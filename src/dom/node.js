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