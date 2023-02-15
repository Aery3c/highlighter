// @flow
'use strict'
import { isCharacterDataNode } from './isCharacterDataNode';
import { getNodeIndex } from './getNodeIndex';

export function splitNode (ancestor: any, descendant: any, descendantOffset: any): void {

  let newNode, splitAtStart = (descendantOffset === 0);

  if (isCharacterDataNode(descendant)) {
    let index = getNodeIndex(descendant);

    if (descendantOffset === 0) {
      descendantOffset = index;

    } else if (descendantOffset === descendant.data.length) {
      descendantOffset = index + 1;
    }
    descendant = descendant.parentNode;
  }

  if (isSplitPoint(descendant, descendantOffset)) {
    // clone empty node
    newNode = descendant.cloneNode(false);
    if (newNode.hasAttribute('id')) {
      newNode.removeAttribute('id');
    }
    let child, newIndex = 0;
    while ((child = descendant.childNodes[descendantOffset])) {
      // move child to newNode
      moveNode(child, newNode, newIndex++);
    }
    // move newNode to parentNode
    moveNode(newNode, descendant.parentNode, getNodeIndex(descendant) + 1);
  } else if (ancestor !== descendant) {
    newNode = descendant.parentNode;

    // Work out a new split point in the parent node
    let newNodeIndex = getNodeIndex(descendant);

    if (!splitAtStart) {
      newNodeIndex++;
    }
    return splitNode(ancestor, newNode, newNodeIndex);
  }
}

function isSplitPoint(node: Node, offset: number): boolean {
  // Node.TEXT_NODE
  if (isCharacterDataNode(node)) {
    if (offset === 0) {
      return !!node.previousSibling;
      // $FlowIgnore
    } else if (offset === node.length) {
      return !!node.nextSibling;
    } else {
      return true;
    }
  }

  // Node.ELEMENT_NODE
  return offset > 0 && offset < node.childNodes.length;
}
export function removeNode (node: Node): Node | null {
  const p = node.parentNode;
  if (p) {
    return p.removeChild(node);
  }

  return null;
}

export function moveNode (node: Node, newNode: Node, newIndex: number): void {
  if (newIndex === -1) {
    newIndex = newNode.childNodes.length;
  }

  if (newIndex === newNode.childNodes.length) {
    newNode.appendChild(node);
  } else {
    newNode.insertBefore(node, newNode.childNodes[newIndex]);
  }
}