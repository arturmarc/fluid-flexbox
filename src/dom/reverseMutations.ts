export function reverseMutations(mutations: MutationRecord[]) {
  for (const mutation of mutations) {
    switch (mutation.type) {
      case "childList":
        revertChildListMutation(mutation);
        break;
      case "attributes":
        revertAttributeMutation(mutation);
        break;
      case "characterData":
        revertCharacterDataMutation(mutation);
        break;
      default:
        const exhaustiveCheck: never = mutation.type;
    }
  }
}

export function startRecordingMutations(targetNode: HTMLElement) {
  const mutations: MutationRecord[] = [];
  const observer = new MutationObserver((mutations) => {
    mutations.push(...mutations);
  });
  observer.observe(targetNode, {
    subtree: true,
    childList: true,
    attributes: true,
    characterData: true,
    attributeOldValue: true,
    characterDataOldValue: true,
  });
  return {
    stopAndGetMutations: () => {
      mutations.push(...observer.takeRecords());
      observer.disconnect();
      return mutations;
    },
  };
}

function revertChildListMutation(mutation: MutationRecord) {
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

function revertAttributeMutation(mutation: MutationRecord) {
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

function revertCharacterDataMutation(mutation: MutationRecord) {
  mutation.target.textContent = mutation.oldValue;
}
