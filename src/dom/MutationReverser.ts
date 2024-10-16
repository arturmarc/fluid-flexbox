/**
 * TODO test and use this
 * A utility class that tracks and reverses DOM mutations.
 */
class MutationReverser {
  constructor(targetNode: HTMLElement) {
    this.targetNode = targetNode;
    this.mutations = [];
    this.observer = null;
  }

  targetNode: HTMLElement;
  mutations: MutationRecord[];
  observer: MutationObserver | null;

  startTracking() {
    this.observer = new MutationObserver((mutations) => {
      this.mutations.push(...mutations);
    });

    this.observer.observe(this.targetNode, {
      subtree: true,
      childList: true,
      attributes: true,
      characterData: true,
      attributeOldValue: true,
      characterDataOldValue: true,
    });
  }

  stopTracking() {
    this.observer?.disconnect();
    this.mutations = [];
  }

  revertAll() {
    // Process mutations in reverse order
    for (const mutation of [...this.mutations].reverse()) {
      this.revertMutation(mutation);
    }
    this.mutations = [];
  }

  revertMutation(mutation: MutationRecord) {
    switch (mutation.type) {
      case "childList":
        this.revertChildListMutation(mutation);
        break;
      case "attributes":
        this.revertAttributeMutation(mutation);
        break;
      case "characterData":
        this.revertCharacterDataMutation(mutation);
        break;
      default:
        const exhaustiveCheck: never = mutation.type;
    }
  }

  revertChildListMutation(mutation: MutationRecord) {
    // Re-insert removed nodes
    mutation.removedNodes.forEach((node) => {
      if (mutation.nextSibling) {
        mutation.target.insertBefore(node, mutation.nextSibling);
      } else {
        mutation.target.appendChild(node);
      }
    });

    // Remove added nodes
    mutation.addedNodes.forEach((node) => {
      if (node.parentNode) {
        node.parentNode.removeChild(node);
      }
    });
  }

  revertAttributeMutation(mutation: MutationRecord) {
    const element = mutation.target as HTMLElement;
    const attributeName = mutation.attributeName;
    if (!attributeName) {
      return;
    }
    const oldValue = mutation.oldValue;

    if (oldValue === null) {
      element.removeAttribute(attributeName);
    } else {
      element.setAttribute(attributeName, oldValue);
    }
  }

  revertCharacterDataMutation(mutation: MutationRecord) {
    mutation.target.textContent = mutation.oldValue;
  }
}
