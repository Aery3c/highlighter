'use strict'

import core from '@/core';

/**
 *
 * @param {Node} ancestor
 * @param {Node | Text} descendant
 * @param {number} descendantOffset
 */
export default function splitNodeAt (ancestor, descendant, descendantOffset) {

  if (core.dom.isCharacterDataNode(descendant)) {
    let index = core.dom.getNodeIndex(descendant);

    if (descendantOffset === 0) {
      descendantOffset = index;
    } else if (descendantOffset === descendant.data.length) {
      descendantOffset = index + 1;
    }
    descendant = descendant.parentNode;
  }
  // 必须保证节点被range分割, 否则会出现空的节点
  if (core.utils.isSplitPoint(descendant, descendantOffset)) {
    // clone empty node
    let newNode = descendant.cloneNode(false);
    if (newNode.hasAttribute('id')) {
      newNode.removeAttribute('id');
    }
    let child, newIndex = 0;
    while ((child = descendant.childNodes[descendantOffset])) {
      // move child to newNode
      core.dom.moveNode(child, newNode, newIndex++);
    }
    // move newNode to parentNode
    core.dom.moveNode(newNode, descendant.parentNode, core.dom.getNodeIndex(descendant) + 1);
  }
}