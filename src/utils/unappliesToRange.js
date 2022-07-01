'use strict'

import core from '@/core';

/**
 * unapplies to then range
 * @param {Range} range
 * @param {string} [className]
 */
function unappliesToRange(range, className) {

  const characterRange = range.toCharacterRange();

  range.splitBoundaries();

  const textNodes = core.utils.getEffectiveTextNodes(range);

  if (textNodes.length) {
    // split boundaries ancestor with class
    splitBoundariesAncestorWithClass(range, className);
    textNodes.forEach(textNode => {
      let ancestorWithClass = core.dom.getSelfOrAncestorWithClass(textNode, className);
      if (ancestorWithClass) {
        undoToAncestor(ancestorWithClass, className);
      }
    });

    core.dom.normalize(textNodes, range, true);
  }

  range.moveToCharacterRange(characterRange);
}

/**
 *
 * @param {Node} ancestorWithClass
 * @param {string} className
 * @return {Node[]}
 */
function undoToAncestor (ancestorWithClass, className) {
  if (isRemovable(ancestorWithClass, className)) {
    let child, children = [],
      parentNode = ancestorWithClass.parentNode,
      index = core.dom.getNodeIndex(ancestorWithClass);

    while ((child = ancestorWithClass.firstChild)) {
      // move children to sibling
      core.dom.moveNode(child, parentNode, index++);
      children.push(child);
    }

    // remove self
    core.dom.removeNode(ancestorWithClass);

    return children;
  } else {
    core.dom.removeClass(ancestorWithClass, className);
  }
}

/**
 *
 * @param {HTMLElement | Node} ancestorWithClass
 * @param {string} className
 * @return {boolean}
 */
function isRemovable (ancestorWithClass, className) {
  return core.dom.getClass(ancestorWithClass) === className;
}


/**
 *
 * @param {Range} range
 * @param {string} className
 */
function splitBoundariesAncestorWithClass (range, className) {
  [{ node: range.endContainer, offset: range.endOffset }, { node: range.startContainer, offset: range.startOffset }]
    .forEach(({ node, offset }) => {
      const ancestorWithClass = core.dom.getSelfOrAncestorWithClass(node, className);
      if (ancestorWithClass) {
        splitNodeAt(ancestorWithClass, node, offset);
      }
    });
}

/**
 *
 * @param {Node} ancestor
 * @param {Node | Text} descendant
 * @param {number} descendantOffset
 */
function splitNodeAt (ancestor, descendant, descendantOffset) {

  let newNode, splitAtStart = (descendantOffset === 0);

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
    newNode = descendant.cloneNode(false);
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
  } else if (ancestor !== descendant) {
    newNode = descendant.parentNode;

    // Work out a new split point in the parent node
    let newNodeIndex = core.dom.getNodeIndex(descendant);

    if (!splitAtStart) {
      newNodeIndex++;
    }
    return splitNodeAt(ancestor, newNode, newNodeIndex);
  }
}

export default unappliesToRange;
