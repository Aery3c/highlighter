'use strict'

import { extend } from '@/utils';
import { addClass, toggleClass, getClass, removeClass, hasClass, classesToArray } from './classes';
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

/**
 *
 * @param {Node} newNode
 * @param {Node} referenceNode
 * @return {Node}
 */
export function insertAfter (newNode, referenceNode) {
  let p = referenceNode.parentNode, next = referenceNode.nextSibling;
  if (!next) {
    return p.appendChild(newNode);
  } else {
    return p.insertBefore(newNode, next);
  }
}

/**
 *
 * @param {Node} newNode
 * @param {Node | Text} referenceNode
 * @param {number} offset
 * @return {Node}
 */
export function insertPoint (newNode, referenceNode, offset) {
  if (isCharacterDataNode(referenceNode)) {
    if (offset === referenceNode.length) {
      insertAfter(newNode, referenceNode);
    } else {
      referenceNode.parentNode.insertBefore(newNode, offset === 0 ? referenceNode : referenceNode.splitText(offset));
    }
  } else if (offset >= referenceNode.childNodes.length) {
    referenceNode.appendChild(newNode);
  } else {
    referenceNode.insertBefore(newNode, referenceNode.childNodes[offset]);
  }

  return newNode;
}

/**
 *
 * @param {Node} ancestor
 * @param {Node} descendant
 * @param {boolean} selfIsAncestor
 */
export function isAncestorOf (ancestor, descendant, selfIsAncestor) {
  let n = selfIsAncestor ? descendant : descendant.parentNode;
  while (n) {
    if (n === ancestor) {
      return true;
    } else {
      n = n.parentNode;
    }
  }
  return false;
}

/**
 *
 * @param {Node} ancestor
 * @param {Node} descendant
 * @return {boolean}
 */
export function isOrIsAncestorOf(ancestor, descendant) {
  return isAncestorOf(ancestor, descendant, true);
}

/**
 *
 * @param {Node} node
 * @param {Node} boundaryPoint
 * @return {boolean}
 */
export function isPartiallySelected (node, boundaryPoint) {
  return isOrIsAncestorOf(node, boundaryPoint);
}

/**
 *
 * @param {RangeIterator} it
 * @param {() => void} cb
 */
export function iterateSubtree (it, cb) {
  let node;
  while((node = it.next())) {
    // todo
  }
}

export { addClass, toggleClass, getClass, removeClass, hasClass, classesToArray }

extend(dom, {
  getNodeLength,
  getNodeIndex,
  gE,
  isCharacterDataNode,
  findClosestAncestor,
  insertAfter,
  addClass,
  toggleClass,
  getClass,
  removeClass,
  hasClass,
  classesToArray,
  insertPoint,
  isAncestorOf,
  isOrIsAncestorOf,
  isPartiallySelected,
  iterateSubtree
});

export default dom;
