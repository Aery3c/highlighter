'use strict'

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
 * @return {boolean}
 */
export function isAncestorOf (ancestor, descendant) {
  return !!(ancestor.compareDocumentPosition(descendant) & 16);
}