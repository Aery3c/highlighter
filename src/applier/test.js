import core from "@/core";

function isSplitPoint(node, offset) {
  if (core.dom.isCharacterDataNode(node)) {
    if (offset === 0) {
      return !!node.previousSibling;
    } else if (offset === node.length) {
      return !!node.nextSibling;
    } else {
      return true;
    }
  }

  return offset > 0 && offset < node.childNodes.length;
}

/**
 *
 * @param {Node} ancestor
 * @param {Node} descendant
 * @param {number} descendantOffset
 */
export function splitNodeAt(ancestor, descendant, descendantOffset) {
  let newNode, parentNode;
  const splitAtStart = (descendantOffset === 0);

  if (core.dom.isAncestorOf(descendant, ancestor)) {
    return ancestor;
  }

  if (core.dom.isCharacterDataNode(descendant)) {
    let descendantIndex = core.dom.getNodeIndex(descendant);
    if (descendantOffset === 0) {
      descendantOffset = descendantIndex;
    } else if (descendantOffset === descendant.length) {
      descendantOffset = descendantIndex + 1;
    }
    descendant = descendant.parentNode;
  }

  if (isSplitPoint(descendant, descendantOffset)) {
    // descendantNode is now guaranteed not to be a text or other character node
    newNode = descendant.cloneNode(false);
    parentNode = descendant.parentNode;
    if (newNode.id) {
      newNode.removeAttribute("id");
    }
    let child, newChildIndex = 0;

    while ( (child = descendant.childNodes[descendantOffset]) ) {
      moveChild(child, newNode, newChildIndex++);
    }
    moveChild(newNode, parentNode, core.dom.getNodeIndex(descendant) + 1);
    return (descendant === ancestor) ? newNode : splitNodeAt(ancestor, parentNode, core.dom.getNodeIndex(newNode));

  } else if (ancestor !== descendant) {
    newNode = descendant.parentNode;

    // Work out a new split point in the parent node
    let newNodeIndex = core.dom.getNodeIndex(descendant);

    if (!splitAtStart) {
      newNodeIndex++;
    }
    return splitNodeAt(ancestor, newNode, newNodeIndex);
  }
  return ancestor;
}

function moveChild (node, parentNode, index) {
  // For convenience, allow newIndex to be -1 to mean "insert at the end".
  if (index === -1) {
    index = parentNode.childNodes.length;
  }

  // Now actually move the node.
  if (parentNode.childNodes.length === index) {
    parentNode.appendChild(node);
  } else {
    parentNode.insertBefore(node, parentNode.childNodes[index]);
  }
}