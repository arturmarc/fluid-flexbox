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

  static observedAttributes = ["wrapping-class", "set-wrapping-content"];

  attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    if (name === "wrapping-class") {
      this.wrappingClass = newValue || "";
    }
    if (name === "set-wrapping-content") {
      this.setWrappingContent = true;
    }
  }

  wrappingClass: string = "";

  setWrappingContent: boolean = false;

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

  isWrapping = false;

  nonWrappingElSize: Size | null = null;

  wrappingElSize: Size | null = null;

  mutatingInternally = false;

  // marks the first time the slot has changed
  // slightly different handling in needed in that case
  firstSlotChange = true;

  mutationReverser: MutationReverser | null = null;

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
        .wrapping-content {
          display: none;
        }  
        .content, .wrapping-content {
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
      <div class="wrapping-content">
        <slot name="wrapping-content"></slot>
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

    console.log("CONSRUCTOR", this.slotElement);

    // this.mutationReverser = new MutationReverser(this.slotElement);
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

    if (this.firstSlotChange && this.wrappingChangeApplied) {
      // again, if cloned, the class might be applied already
      // clearing it here so it won't get copied to invisible elements
      // it will get re-applied in size observer
      this.applyWrappingChange(false);
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
    this.mutationObserver = new MutationObserver(
      (mutationList: MutationRecord[]) => {
        console.log(
          this.mutatingInternally,
          "mutatingInternally",
          this.getAttribute("classname"),
          mutationList,
        );
        if (this.mutatingInternally) {
          return;
        }

        for (let mutation of mutationList) {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "class" &&
            mutation.target instanceof HTMLElement
          ) {
            const mutEl = mutation.target as HTMLElement;
            if (
              mutEl === this.childElement &&
              this.wrappingChangeApplied &&
              !mutEl.className.match(new RegExp(`${this.wrappingClass}$`))
            ) {
              console.warn(
                "[flex-wrap-detector] Changing the wrapping class " +
                  "applied by the detector can cause unexpected behavior.",
              );
              mutEl.className =
                `${mutEl.className} ${this.wrappingClass}`.trim();
            }
          }
        }
        this.copyChildToInvisibleElements();
        this.initResizeObservers();
      },
    );

    // todo benchmark if this is fast enough
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
      sizeProp?: "nonWrappingElSize" | "wrappingElSize",
    ) => {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (!entry.contentBoxSize) {
            continue;
          }
          if (sizeProp) {
            this[sizeProp] = {
              w: entry.contentBoxSize[0].inlineSize,
              h: entry.contentBoxSize[0].blockSize,
            };
          }
          this.checkIfWrapping();
        }
      });
      this.resizeObservers.push(resizeObserver);

      resizeObserver.observe(el);
    };
    // console.log("init observers", this.slotElement);
    initObserver(this.invisibleNonWrappingEl, "nonWrappingElSize");
    initObserver(this.invisibleWrappingEl, "wrappingElSize");
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
    if (!this.nonWrappingElSize || !this.wrappingElSize) {
      return;
    }

    if (this.nonWrappingElSize.h === this.wrappingElSize.h) {
      const lastChildNonWrapping = this.invisibleNonWrappingEl
        .lastElementChild as HTMLElement;
      const lastChildWrapping = this.invisibleWrappingEl
        .lastElementChild as HTMLElement;

      if (lastChildNonWrapping && lastChildWrapping) {
        this.isWrapping =
          lastChildNonWrapping.offsetTop !== lastChildWrapping.offsetTop;
      }
    } else {
      this.isWrapping = this.nonWrappingElSize.h !== this.wrappingElSize.h;
    }

    // console.log("isWrapping", this.isWrapping);

    if (this.isWrapping && !this.wrappingChangeApplied) {
      this.applyWrappingChange(true);
    }
    if (!this.isWrapping && this.wrappingChangeApplied) {
      this.applyWrappingChange(false);
    }
  }

  // need to remember this value because the element might get copied
  // with the wrapping already applied so keep it in an attribute
  set wrappingChangeApplied(val: boolean) {
    this.mutatingInternally = true;
    // todo benchmark if this is fast enough
    if (val) {
      this.setAttribute("data-wrapping-class-applied", "true");
    } else {
      this.removeAttribute("data-wrapping-class-applied");
    }
    setTimeout(() => {
      // clear mutating flag on next tick
      this.mutatingInternally = false;
    });
  }

  get wrappingChangeApplied() {
    return this.hasAttribute("data-wrapping-class-applied");
  }

  get wrappingContent() {
    return this.querySelector(":scope > [slot='wrapping-content']");
  }

  applyWrappingChange(isWrapping: boolean) {
    this.mutatingInternally = true;
    let wrappingContent = this.wrappingContent;
    if (wrappingContent || this.setWrappingContent) {
      if (wrappingContent && this.wrappingClass) {
        console.warn(
          '[flex-wrap-detector] "wrapping-content" slot is set. The wrapping-class won\'t be applied.',
        );
      }
      if (this.setWrappingContent && this.wrappingClass) {
        console.warn(
          '[flex-wrap-detector] "set-wrapping-content" attribute is set. The wrapping-class won\'t be applied.',
        );
      }
      if (!wrappingContent) {
        wrappingContent = this.createWrappingContent();
      }
      this.showHideWrappingContent(isWrapping);
    } else {
      this.setWrappingClass(isWrapping);
    }
    this.wrappingChangeApplied = isWrapping; // mark change as applied internally
    setTimeout(() => {
      // clear mutating flag on next tick
      this.mutatingInternally = false;
    });
  }

  setWrappingClass(isWrapping: boolean) {
    if (this.wrappingClass) {
      if (isWrapping) {
        this.childElement.className =
          `${this.childElement.className} ${this.wrappingClass}`.trim();
      } else {
        this.childElement.className = this.childElement.className
          .replace(`${this.wrappingClass}`, "")
          .trim();
      }
    }
  }

  showHideWrappingContent(isWrapping: boolean) {
    const contentWhenWrappingContainer = this.shadowRoot?.querySelector(
      ".wrapping-content",
    ) as HTMLElement;
    if (contentWhenWrappingContainer) {
      contentWhenWrappingContainer.style.display = isWrapping
        ? "block"
        : "none";
    }
    const contentContainer = this.shadowRoot?.querySelector(
      ".content",
    ) as HTMLElement;
    if (contentContainer) {
      contentContainer.style.display = isWrapping ? "none" : "block";
    }
  }

  createWrappingContent() {
    // if wrapping-content is *not* provided directly as a slot
    // and "set-wrapping-content" is set, create a copy of the child element
    const wrappingContent = this.childElement.cloneNode(true) as HTMLElement;
    wrappingContent.slot = "wrapping-content";

    // this event will only fire once and is used to set the wrapping content
    // using existing content
    const event = new CustomEvent("set-wrapping-content", {
      detail: {
        element: wrappingContent,
      },
      bubbles: false,
      composed: false,
    });
    // ! TODO using mutation reverser so a copy does not have to be created
    // but changes can be done by doing mutations on the original element
    this.dispatchEvent(event);
    this.childElement.parentElement?.insertBefore(
      wrappingContent,
      this.childElement,
    );
    return wrappingContent;
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
};

interface Size {
  w: number;
  h: number;
}

customElements.define("flex-wrap-detector", FlexWrapDetectorElement);
