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
export function hasClass (el, className) {
  return el.classList.contains(className);
}

/**
 *
 * @param {HTMLElement} el1
 * @param {HTMLElement} el2
 */
export function haveSameClass (el1, el2) {
  return sortClass(el1.className) === sortClass(el2.className);
}

/**
 *
 * @param {string} className
 * @return {string}
 */
export function sortClass (className) {
  return className.split(/\s+/).sort().join(' ');
}

/**
 *
 * @param {Node} node
 */
export function removeNode (node) {
  return node.parentNode.removeChild(node);
}

/**
 *
 * @param {Node} node
 * @param {Node} parentNode
 * @param {boolean} removeSelf
 * @return {Node[]}
 */
export function moveChildren (node, parentNode, removeSelf) {
  let child, children = [], index = getNodeIndex(node);
  while ((child = node.firstChild)) {
    moveChild(child, parentNode, index++);
    children.push(child);
  }

  if (removeSelf) {
    parentNode.removeChild(node);
  }

  return children;
}

function moveChild (node, parentNode, index) {
  // For convenience, allow newIndex to be -1 to mean "insert at the end".
  if (index === -1) {
    index = parentNode.childNodes.length;
  }

  // Now actually move the node.
  if (parentNode.childNodes.length === index) {
    parentNode.appendChild(node);
  } else {
    parentNode.insertBefore(node, parentNode.childNodes[index]);
  }
}

/**
 *
 * @param {Node} ancestor
 * @param {Node} descendant
 * @param {number} descendantOffset
 */

export function splitNodeAt(ancestor, descendant, descendantOffset) {
  let newNode, parentNode;
  const splitAtStart = (descendantOffset === 0);

  if (isAncestorOf(descendant, ancestor)) {
    return ancestor;
  }

  if (isCharacterDataNode(descendant)) {
    let descendantIndex = getNodeIndex(descendant);
    if (descendantOffset === 0) {
      descendantOffset = descendantIndex;
    } else if (descendantOffset === descendant.length) {
      descendantOffset = descendantIndex + 1;
    }
    descendant = descendant.parentNode;
  }

  if (isSplitPoint(descendant, descendantOffset)) {
    // descendantNode is now guaranteed not to be a text or other character node
    newNode = descendant.cloneNode(false);
    parentNode = descendant.parentNode;
    if (newNode.id) {
      newNode.removeAttribute("id");
    }
    let child, newChildIndex = 0;

    while ( (child = descendant.childNodes[descendantOffset]) ) {
      moveChild(child, newNode, newChildIndex++);
    }
    moveChild(newNode, parentNode, getNodeIndex(descendant) + 1);
    return (descendant === ancestor) ? newNode : splitNodeAt(ancestor, parentNode, getNodeIndex(newNode));

  } else if (ancestor !== descendant) {
    newNode = descendant.parentNode;

    // Work out a new split point in the parent node
    let newNodeIndex = getNodeIndex(descendant);

    if (!splitAtStart) {
      newNodeIndex++;
    }
    return splitNodeAt(ancestor, newNode, newNodeIndex);
  }
  return ancestor;
}

function isSplitPoint(node, offset) {
  if (isCharacterDataNode(node)) {
    if (offset === 0) {
      return !!node.previousSibling;
    } else if (offset === node.length) {
      return !!node.nextSibling;
    } else {
      return true;
    }
  }

  return offset > 0 && offset < node.childNodes.length;
}

/**
 *
 * @param {Node} node
 * @return {boolean}
 */
export function isEmptyElement (node) {
  const childCount = node.childNodes.length;
  return node.nodeType === Node.ELEMENT_NODE && (childCount === 0) || (childCount === 1 && isEmptyElement(node.firstChild));
}

/**
 *
 * @param {Object} attrs
 * @param {HTMLElement} el
 */
export function copyAttributesToElement (attrs, el) {
  for (let attrName in attrs) {
    if (Object.prototype.hasOwnProperty.call(attrs, attrName)) {
      el.setAttribute(attrName, attrs[attrName]);
    }
  }
}

/**
 *
 * @param {HTMLElement} el
 * @param {string} className
 * @return {boolean}
 */
export function toggleClass (el, className) {
  return el.classList.toggle(className);
}

/**
 *
 * @param {HTMLElement} el
 * @param {string} className
 * @returns {void}
 */
export function removeClass (el, className) {
  return el.classList.remove(className);
}