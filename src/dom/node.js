'use strict'

import core from '@/core';

/**
 * 返回node在容器中的位置
 * @param {Node} node
 * @return {number}
 */
export function getNodeIndex (node) {
  let index = 0;
  while ((node = node.previousSibling)) {
    index++;
  }

  return index;
}

/**
 * 如果ancestor是descendant的祖先节点, 返回true, 否则返回false
 * @param {Node} ancestor
 * @param {Node} descendant
 * @param {boolean} [selfIsAncestor]
 * @return {boolean}
 */
export function isAncestorOf (ancestor, descendant, selfIsAncestor = false) {
  let n = selfIsAncestor ? descendant : descendant.parentNode;

  while (n) {
    if (n === ancestor) {
      return true;
    } else {
      n = n.parentNode
    }
  }

  return false;
}

export function isOrIsAncestorOf (ancestor, descendant) {
  return isAncestorOf(ancestor, descendant, true);
}

/**
 * 返回节点的长度
 *
 * 如果是元素节点, 返回子节点的数量
 *
 * 如果是文本节点, 返回节点的文本长度
 * @param {Node | Text} node
 * @return {number}
 */
export function getNodeLength (node) {
  switch (node.nodeType) {
    case Node.ELEMENT_NODE:
      return node.childNodes.length;

    case Node.CDATA_SECTION_NODE:
    case Node.COMMENT_NODE:
    case Node.TEXT_NODE:
      return node.length;

    default:
      return 0;
  }
}

/**
 * remove node
 * @see https://developer.mozilla.org/zh-CN/docs/Web/API/Node/removeChild
 * @param {Node} node
 * @return {Node | any}
 */
export function removeNode (node) {
  return node.parentNode.removeChild(node);
}

/**
 *
 * @param {Node} node
 * @param {Node} precedingNode
 * @return {Node}
 */
export function insertAfter (node, precedingNode) {
  let next = precedingNode.nextSibling, parent = precedingNode.parentNode;
  if (next) {
    parent.insertBefore(node, next);
  } else {
    parent.appendChild(node);
  }

  return node;
}

/**
 * 将node移动到parentNode
 * @param {Node} node
 * @param {Node} parentNode
 * @param {number} index
 */
export function moveNode (node, parentNode, index) {
  if (index === -1) {
    index = parentNode.childNodes.length;
  }

  if (index === parentNode.childNodes.length) {
    parentNode.appendChild(node);
  } else {
    parentNode.insertBefore(node, parentNode.childNodes[index]);
  }
}

export function isWindow (obj) {
  return obj != null && obj === obj.window;
}

/**
 *
 * @param {Node} ancestor
 * @param {Node | Text} descendant
 * @param {number} descendantOffset
 */
export function splitNodeAt (ancestor, descendant, descendantOffset) {

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