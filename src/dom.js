'use strict'

import RangeIterator from './core/rangeIterator';
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

/**
 *
 * @param {Range} range
 * @param {number} whatToShow
 * @param {NodeFilter} [filter]
 */
export function getNodesInRange (range, whatToShow, filter) {
  let nodes = [], it = RangeIterator.createRangeIterator(range, whatToShow, filter), node;
  while ((node = it.next().value)) {
    nodes.push(node);
  }
  return nodes;
}

/**
 *
 * @param {Node} node
 * @param {Node} ancestor
 * @return {Node | null}
 */
export function getClosestAncestorIn (node, ancestor) {
  let p;
  while (node) {
    p = node.parentNode;
    if (p === ancestor) {
      return node;
    }
    node = p;
  }

  return null;
}

/**
 *
 * @param {Node} ancestor
 * @param {Node} descendant
 * @return {boolean}
 */
export function isAncestorOf (ancestor, descendant) {
  return !!(ancestor.compareDocumentPosition(descendant) & 16)
}

/**
 *
 * @param {Node} node
 * @return {number}
 */
export function getNodeLength (node) {
  switch (node.nodeType) {
    case Node.PROCESSING_INSTRUCTION_NODE:
    case Node.DOCUMENT_TYPE_NODE:
      return 0;
    case Node.TEXT_NODE:
    case Node.COMMENT_NODE:
      return node.length;
    default:
      return node.childNodes.length;
  }
}

/**
 *
 * @param {HTMLElement} el
 * @param {string} className
 */
export function addClass (el, className) {
  el.classList.add(className);
}

/**
 *
 * @param {HTMLElement} el
 * @param {string} className
 * @return {boolean}
 */
export function hasClass(el, className) {
  return el.classList.contains(className);
}