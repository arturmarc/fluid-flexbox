import { reverseMutations, startRecordingMutations } from "./reverseMutations";

export class FlexWrapDetectorElement extends HTMLElement {
  // The child element of this custom element.
  // it has to be a single child that will become
  // flex row container (if it is not already)
  rawChildElement: HTMLElement | null = null;

  // type-safe getter
  get childElement() {
    if (!this.rawChildElement) {
      throw "[flex-wrap-detector] Something went wrong. No child element.";
    }
    return this.rawChildElement as HTMLElement;
  }

  static observedAttributes = ["wrapped-class"];

  attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    if (name === "wrapped-class") {
      this.wrappedClass = newValue || "";
    }
    // TODO - add and handle wrapped-style custom attribute
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
  // this one has flex-wrap: wrap forced
  invisibleWrappingEl: HTMLElement | null = null;

  mutationObserver: MutationObserver | null = null;

  resizeObserver: ResizeObserver | null = null;

  // mark mutations that happen internally
  // so the mutation observer can skip them
  mutatingInternally = false;

  // save mutations to wrapped content to be able to reverse them
  wrappedContentMutations: MutationRecord[] = [];

  skipNextCheckIfWrapping = false;

  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });

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
        .invisible-non-wrapping.wrapped {
          height: 1px;
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

  connectedCallback() {
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
  }

  disconnectedCallback() {
    const pendingMutations = this.mutationObserver?.takeRecords();
    if (pendingMutations && pendingMutations.length > 0) {
      // make sure to handle mutations before disconnecting
      this.handleMutations();
    }
    this.mutationObserver?.disconnect();
    this.resizeObserver?.disconnect();
  }

  copyChildToInvisibleElements() {
    const existingNonWrapping = this.querySelector(
      ":scope > [slot='invisible-non-wrapping']",
    ) as HTMLElement | null;
    const existingWrapping = this.querySelector(
      ":scope > [slot='invisible-wrapping']",
    ) as HTMLElement | null;
    if (
      existingNonWrapping &&
      existingWrapping &&
      !this.invisibleNonWrappingEl &&
      !this.invisibleWrappingEl
    ) {
      // re-use existing invisible elements
      // they might already be there if the element has been cloned
      // (likely when nesting flex-wrap-detectors)
      this.invisibleNonWrappingEl = existingNonWrapping;
      this.invisibleWrappingEl = existingWrapping;
      return;
    }

    // clear already existing invisible copies
    this.querySelector(":scope > [slot='invisible-non-wrapping']")?.remove();
    this.querySelector(":scope > [slot='invisible-wrapping']")?.remove();

    if (this.children.length > 2) {
      console.error(
        "[flex-wrap-detector] Something went wrong. Too many child elements.",
      );
    }

    this.invisibleNonWrappingEl = this.childElement.cloneNode(
      true,
    ) as HTMLElement;
    setStyleAndAttrDefaultsForInvisible(this.invisibleNonWrappingEl);
    // the following style is needed to make sure the children of the non-wrapping
    // hidden clone are not expanding the container horizontally
    // (without it the text inside might start wrapping to the next line)
    // (it can't be applied using cs because those are not direct children of the detector)
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

    this.initResizeObserver();
  }

  initMutationObserver() {
    this.mutationObserver?.disconnect();
    this.mutationObserver = new MutationObserver(
      this.handleMutations.bind(this),
    );

    this.mutationObserver.observe(this.childElement, {
      childList: true,
      attributes: true,
      characterData: true,
      subtree: true,
    });
  }

  handleMutations() {
    if (this.mutatingInternally) {
      return;
    }

    if (this.wrappedChangesApplied) {
      const suppressWarning = this.hasAttribute("suppress-warning");
      if (suppressWarning) {
        return;
      }

      console.warn(
        "[flex-wrap-detector] Changes to observed content detected while wrapped. " +
          "This will likely have undesired effects. See more at https://github.com/arturmarc/fluid-flexbox/flex-wrap-detector#dynamic-content " +
          "You might see this warning because of nested <flex-wrap-detector> elements. " +
          "In that case, or if you understand the implications, you can suppress this warning by " +
          "adding a 'suppress-warning' attribute to the <flx-wrap-detector> . ",
      );
      return;
    }
    // todo - consider benchmarking if this is fast enough
    this.copyChildToInvisibleElements();
  }

  initResizeObserver() {
    if (!this.invisibleNonWrappingEl || !this.invisibleWrappingEl) {
      throw "[flex-wrap-detector] Failed to init resize observer. No child element.";
    }

    this.resizeObserver?.disconnect();

    this.resizeObserver = new ResizeObserver(() => {
      this.checkIfWrappingAndApply();
    });

    this.resizeObserver.observe(this.invisibleNonWrappingEl);
    this.resizeObserver.observe(this.invisibleWrappingEl);
    this.resizeObserver.observe(this);
  }

  checkIfWrapping() {
    if (
      !this.invisibleNonWrappingEl ||
      !this.invisibleWrappingEl ||
      !this.childElement
    ) {
      throw "[flex-wrap-detector] Failed to check if overflowing. References missing this is a bug.";
    }
    // check children's offset top
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
        return true;
      }
    }
    return false;
  }

  checkIfWrappingAndApply() {
    if (this.skipNextCheckIfWrapping) {
      this.skipNextCheckIfWrapping = false;
      return;
    }
    const isWrapped = this.checkIfWrapping();

    if (isWrapped && !this.wrappedChangesApplied) {
      this.applyWrappedChange(true);
    }
    if (!isWrapped && this.wrappedChangesApplied) {
      this.applyWrappedChange(false);
    }
  }

  startMutatingInternally() {
    const pendingMutations = this.mutationObserver?.takeRecords();
    if (pendingMutations && pendingMutations.length > 0) {
      this.handleMutations();
    }
    this.mutatingInternally = true;
  }

  endMutatingInternally() {
    this.mutationObserver?.takeRecords();
    this.mutatingInternally = false;
  }

  // need to remember this value because the element might get copied
  // with the wrapped changes already applied so keep it in an attribute
  set wrappedChangesApplied(val: boolean) {
    this.startMutatingInternally();
    // todo - consider benchmarking if this is fast enough
    if (val) {
      this.setAttribute("data-wrapped-changes-applied", "true");
    } else {
      this.removeAttribute("data-wrapped-changes-applied");
    }
    this.endMutatingInternally();
  }

  get wrappedChangesApplied() {
    return this.hasAttribute("data-wrapped-changes-applied");
  }

  applyWrappedChange(isWrapped: boolean) {
    this.startMutatingInternally();

    // extra styling needed for invisible non-wrapping
    this.shadowRoot
      ?.querySelector(".invisible-non-wrapping")
      ?.classList.toggle("wrapped", isWrapped);

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

    // check if the change is causing an infinite loop
    const isWrappedAfterApplying = this.checkIfWrapping();
    if (isWrapped && !isWrappedAfterApplying) {
      this.skipNextCheckIfWrapping = true;
    }

    this.endMutatingInternally();
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

  reApplyIfWrapped() {
    if (this.wrappedChangesApplied) {
      this.applyWrappedChange(true);
    }
  }
}

const setStyleAndAttrDefaultsForInvisible = (el: HTMLElement) => {
  el.style.flexWrap = "nowrap";
  el.style.display = "flex";
  el.style.flexDirection = "row";
  el.style.visibility = "hidden ";
  el.removeAttribute("id");
  // remove id attribute from all descendants that have it
  // todo - consider if this is needed, and are there any other modifications
  // that might be needed to make to invisible copies
  el.querySelectorAll("*").forEach((el) => {
    el.setAttribute("id", `${el.getAttribute("id") || ""}-invisible`);
  });
};

customElements.define("flex-wrap-detector", FlexWrapDetectorElement);
