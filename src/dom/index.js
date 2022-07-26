'use strict'

import { extend } from '@/utils';
const dom = {};

/**
 *
 * @param {Node | null} node
 * @return {boolean}
 */
export function isCharacterDataNode (node) {
  if (!node) return false;
  const t = node.nodeType;
  return t === Node.TEXT_NODE || t === Node.COMMENT_NODE;
}

/**
 * the position of the node in the parent node
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
 * The element node returns the child node length, and the text node returns the text length
 * @param {Node|Text} node
 */
export function getNodeLength (node) {
  const t = node.nodeType;
  if (t === Node.ELEMENT_NODE) {
    return node.childNodes.length;
  } else if (isCharacterDataNode(node)) {
    return node.length;
  }
  return 0;
}


/**
 *
 * @param {Node} ancestor
 * @param {Node} node
 * @return {Node | null}
 */
export function findClosestAncestor (ancestor, node) {
  let p;
  while (node) {
    p = node.parentNode;
    if (p === ancestor) {
      return node
    }
    node = p;
  }

  return null;
}

/**
 *
 * @param {string} selector
 * @return {HTMLElement | null}
 */
export function gE (selector) {
  return document.querySelector(selector);
}

extend(dom, {
  getNodeLength,
  getNodeIndex,
  gE,
  isCharacterDataNode,
  findClosestAncestor
});

export default dom;
