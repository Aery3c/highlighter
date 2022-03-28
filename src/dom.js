'use strict'

/**
 *
 * @param {string} id
 * @return {HTMLElement}
 */
export function getContainerElement (id) {
  return id ? document.getElementById(id) : document.body;
}

/**
 *
 * @param {Node} node
 * @return {boolean}
 */
export function isCharacterDataNode (node) {
  const t = node.nodeType;
  return t === Node.TEXT_NODE || t === Node.COMMENT_NODE || t === Node.CDATA_SECTION_NODE;
}

/**
 *
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
