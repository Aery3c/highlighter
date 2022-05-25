
import core from '@/core';

function isSplitPoint(node, offset) {
  // Node.TEXT_NODE
  if (core.dom.isCharacterDataNode(node)) {
    if (offset === 0) {
      return !!node.previousSibling;
    } else if (offset === node.length) {
      return !!node.nextSibling;
    } else {
      return true;
    }
  }

  // Node.ELEMENT_NODE
  return offset > 0 && offset < node.childNodes.length;
}

export default isSplitPoint;