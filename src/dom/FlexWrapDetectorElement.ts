import { reverseMutations, startRecordingMutations } from "./reverseMutations";

export class FlexWrapDetectorElement extends HTMLElement {
  // The child element of this custom element.
  // it has to be a single child that will become
  // (if it is not already) a flex row container
  rawChildElement: HTMLElement | null = null;

  // type-safe getter
  get childElement() {
    if (!this.rawChildElement) {
      throw "[flex-wrap-detector] Something went wrong. No child element.";
    }
    return this.rawChildElement as HTMLElement;
  }

  static observedAttributes = ["wrapped-class", "set-wrapped-content"];

  attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    if (name === "wrapped-class") {
      this.wrappedClass = newValue || "";
    }
    // TODO - add and handle wrapped-style
  }

  wrappedClass: string = "";

  // the main slot
  slotElement: HTMLSlotElement;

  // copy of the child element
  // will go to invisible-non-wrapping slot
  // in this slot a copy of the child element will be placed
  // with flex-wrap: nowrap forced,
  // to compare to the invisible-wrapping slot
  invisibleNonWrappingEl: HTMLElement | null = null;

  // copy of the child element
  // will go to invisible-wrapping slot
  invisibleWrappingEl: HTMLElement | null = null;

  mutationObserver: MutationObserver | null = null;

  resizeObservers: ResizeObserver[] = [];

  isWrapped = false;

  nonWrappingElHeight = 0;

  wrappingElHeight = 0;

  mutatingInternally = false;

  // save mutations to wrapped content to be able to reverse them
  wrappedContentMutations: MutationRecord[] = [];

  // marks the first time the slot has changed
  // slightly different handling is needed in that case
  firstSlotChange = true;

  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    // ?? move this code to connectedCallback
    shadowRoot.innerHTML = `
      <style>
        :host {
          display: grid;
          position: relative;
        }
        .invisible-non-wrapping {
          grid-area: 1/1;
          overflow: hidden;
        }
        .invisible-wrapping {
          position: absolute;
          inset: 0;
          overflow: hidden;
          z-index: -1;
        }
        .wrapped-content {
          display: none;
        }  
        .content, .wrapped-content {
          grid-area: 1/1;
          overflow: hidden;
        }
        ::slotted(*) {
          display: flex;
          position: relative;
        }
      </style>
      <div class="invisible-non-wrapping">
        <slot name="invisible-non-wrapping"></slot>
      </div>
      <div class="invisible-wrapping">
        <slot name="invisible-wrapping"></slot>
      </div>
      <div class="wrapped-content">
        <slot name="wrapped-content"></slot>
      </div>
      <div class="content">
        <slot></slot>
      </div>
    `;

    const slotElement = this.shadowRoot?.querySelector(
      "slot:not([name])",
    ) as HTMLSlotElement;

    if (!this.shadowRoot || !slotElement) {
      throw "[flex-wrap-detector] Failed to attach shadow root.";
    }

    this.slotElement = slotElement;
  }

  handleSlotChange() {
    const slotChildren = this.slotElement.assignedElements();
    if (
      slotChildren.length !== 1 ||
      !(slotChildren[0] instanceof HTMLElement)
    ) {
      throw "[flex-wrap-detector] Expected a single child element.";
    }
    this.rawChildElement = slotChildren[0] as HTMLElement;

    this.copyChildToInvisibleElements();
    this.initMutationObserver();
    this.initResizeObservers();
    this.firstSlotChange = false;
  }

  copyChildToInvisibleElements() {
    // clear already existing invisible copies
    // using querySelector instead of direct references because
    // the element might have been cloned and the references would be invalid
    this.querySelector(":scope > [slot='invisible-non-wrapping']")?.remove();
    this.querySelector(":scope > [slot='invisible-wrapping']")?.remove();

    if (this.children.length > 2) {
      console.error(
        "[flex-wrap-detector] Something went wrong. Too many child elements.",
      );
    }

    if (this.firstSlotChange && this.wrappedChangesApplied) {
      // again, if cloned, the class might be applied already
      // clearing it here so it won't get copied to invisible elements
      // it will get re-applied in size observer
      this.applyWrappedChange(false);
    }

    this.invisibleNonWrappingEl = this.childElement.cloneNode(
      true,
    ) as HTMLElement;
    setStyleAndAttrDefaultsForInvisible(this.invisibleNonWrappingEl);
    // the following is needed to make sure the children of the non-wrapping
    // hidden clone are not expanding the container horizontally
    // (without it the text inside might start wrapping to the next line)
    [...this.invisibleNonWrappingEl.children].forEach((el) => {
      (el as HTMLElement).style.flexShrink = "0";
    });
    this.invisibleNonWrappingEl.dataset["flexWrapDetectorInvisible"] =
      "non-wrapping";
    this.invisibleNonWrappingEl.slot = "invisible-non-wrapping";
    this.childElement.parentElement?.insertBefore(
      this.invisibleNonWrappingEl,
      this.childElement,
    );

    this.invisibleWrappingEl = this.childElement.cloneNode(true) as HTMLElement;
    setStyleAndAttrDefaultsForInvisible(this.invisibleWrappingEl);
    this.invisibleWrappingEl.style.flexWrap = "wrap";
    this.invisibleWrappingEl.dataset["flexWrapDetectorInvisible"] = "wrapping";
    this.invisibleWrappingEl.slot = "invisible-wrapping";
    this.childElement.parentElement?.insertBefore(
      this.invisibleWrappingEl,
      this.childElement,
    );
  }

  initMutationObserver() {
    this.mutationObserver?.disconnect();
    this.mutationObserver = new MutationObserver(() => {
      if (this.mutatingInternally) {
        return;
      }
      // todo - consider benchmarking if this is fast enough
      this.copyChildToInvisibleElements();
      this.initResizeObservers();
    });

    this.mutationObserver.observe(this.childElement, {
      childList: true,
      attributes: true,
      characterData: true,
      subtree: true,
    });
  }

  initResizeObservers() {
    this.resizeObservers.forEach((ro) => ro.disconnect());
    this.resizeObservers = [];

    if (!this.invisibleNonWrappingEl || !this.invisibleWrappingEl) {
      throw "[flex-wrap-detector] Failed to init resize observer. No child element.";
    }

    const initObserver = (
      el: HTMLElement,
      heightProp?: "nonWrappingElHeight" | "wrappingElHeight",
    ) => {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (!entry.contentBoxSize) {
            continue;
          }
          if (heightProp) {
            this[heightProp] = entry.contentBoxSize[0].blockSize;
          }
          this.checkIfWrapping();
        }
      });
      this.resizeObservers.push(resizeObserver);

      resizeObserver.observe(el);
    };

    initObserver(this.invisibleNonWrappingEl, "nonWrappingElHeight");
    initObserver(this.invisibleWrappingEl, "wrappingElHeight");
    initObserver(this); // also check when the whole wrapper re-resizes
  }

  checkIfWrapping() {
    if (
      !this.invisibleNonWrappingEl ||
      !this.invisibleWrappingEl ||
      !this.childElement
    ) {
      throw "[flex-wrap-detector] Failed to check if overflowing. References missing this is a bug.";
    }
    if (!this.nonWrappingElHeight || !this.wrappingElHeight) {
      return;
    }

    if (this.nonWrappingElHeight !== this.wrappingElHeight) {
      // if height are not equal it's wrapped
      this.isWrapped = true;
    } else {
      this.isWrapped = false;
      // if heights are equal, either is not wrapped or need to check children's offset top
      const childCount = this.invisibleNonWrappingEl.childElementCount;
      // go in reverse order for a slight optimization (most of the time the last child will wrap first)
      for (let childIdx = childCount - 1; childIdx >= 0; childIdx -= 1) {
        const nonWrappingChild = this.invisibleNonWrappingEl.children[
          childIdx
        ] as HTMLElement;
        const wrappingChild = this.invisibleWrappingEl.children[
          childIdx
        ] as HTMLElement;
        if (nonWrappingChild.offsetTop !== wrappingChild.offsetTop) {
          this.isWrapped = true;
          break;
        }
      }
    }

    if (this.isWrapped && !this.wrappedChangesApplied) {
      this.applyWrappedChange(true);
    }
    if (!this.isWrapped && this.wrappedChangesApplied) {
      this.applyWrappedChange(false);
    }
  }

  // need to remember this value because the element might get copied
  // with the wrapped changes already applied so keep it in an attribute
  set wrappedChangesApplied(val: boolean) {
    this.mutatingInternally = true;
    // todo - consider benchmarking if this is fast enough
    if (val) {
      this.setAttribute("data-wrapped-changes-applied", "true");
    } else {
      this.removeAttribute("data-wrapped-changes-applied");
    }
    this.mutationObserver?.takeRecords();
    this.mutatingInternally = false;
  }

  get wrappedChangesApplied() {
    return this.hasAttribute("data-wrapped-changes-applied");
  }

  applyWrappedChange(isWrapped: boolean) {
    this.mutatingInternally = true;
    const wrappedContent = this.querySelector(
      ":scope > [slot='wrapped-content']",
    );
    if (wrappedContent) {
      if (wrappedContent && this.wrappedClass) {
        console.warn(
          '[flex-wrap-detector] "wrapped-content" slot is set. The wrapped-class won\'t be applied.',
        );
      }
      // todo - consider: there is no way to detect if the 'set-wrapped-content' event is listened to
      // so no way of warning that if the wrapped-content is set the even won't fire
      // is this a problem?
      this.showHideWrappedContent(isWrapped);
    } else {
      this.doOrUndoWrappingContentMutations(isWrapped);
    }
    this.wrappedChangesApplied = isWrapped; // mark change as applied internally
    this.mutationObserver?.takeRecords(); // flush all mutations to mark internal changes as applied
    this.mutatingInternally = false;
  }

  doOrUndoWrappingContentMutations(isWrapped: boolean) {
    if (isWrapped) {
      const recorder = startRecordingMutations(this.childElement);

      this.childElement.className =
        `${this.childElement.className} ${this.wrappedClass}`.trim();

      const event = new CustomEvent("set-wrapped-content", {
        detail: {
          element: this.childElement,
        },
        bubbles: false,
        composed: false,
      });
      this.dispatchEvent(event);

      this.wrappedContentMutations = recorder.stopAndGetMutations();
    } else {
      reverseMutations(this.wrappedContentMutations);
      this.wrappedContentMutations = [];
    }
  }

  showHideWrappedContent(isWrapped: boolean) {
    const wrappedContentContainer = this.shadowRoot?.querySelector(
      ".wrapped-content",
    ) as HTMLElement;
    if (wrappedContentContainer) {
      wrappedContentContainer.style.display = isWrapped ? "block" : "none";
    }
    const contentContainer = this.shadowRoot?.querySelector(
      ".content",
    ) as HTMLElement;
    if (contentContainer) {
      contentContainer.style.display = isWrapped ? "none" : "block";
    }
  }

  connectedCallback() {
    this.slotElement.addEventListener(
      "slotchange",
      this.handleSlotChange.bind(this),
    );
  }

  disconnectedCallback() {
    this.mutationObserver?.disconnect();
    this.resizeObservers.forEach((ro) => ro.disconnect());
    this.slotElement.removeEventListener("slotchange", this.handleSlotChange);
  }
}

const setStyleAndAttrDefaultsForInvisible = (el: HTMLElement) => {
  el.style.flexWrap = "nowrap";
  el.style.display = "flex";
  el.style.flexDirection = "row";
  el.style.visibility = "hidden ";
  el.removeAttribute("id");
  // remove id attribute from all descendants that have it
  el.querySelectorAll("*").forEach((el) => {
    el.removeAttribute("id");
  });
};

customElements.define("flex-wrap-detector", FlexWrapDetectorElement);
