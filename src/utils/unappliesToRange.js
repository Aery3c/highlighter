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
        core.dom.splitNodeAt(ancestorWithClass, node, offset);
      }
    });
}

export default unappliesToRange;
