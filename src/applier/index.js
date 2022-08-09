'use strict'

import core from '@/core';
import {
  addClass,
  findSelfOrAncestorWithClass,
  isWhiteSpaceTextNode,
  hasClass,
  getClass,
  removeNode,
  isCharacterDataNode,
  getNodeIndex
} from '@/dom';
import { each } from '@/utils';

function createOptions (options) {
  const defaultOptions = {
    tagName: 'span',
    className: 'highlight',
    elAttrs: {},
    elProps: {}
  }

  return Object.assign(defaultOptions, options);
}

/**
 * Applier Object
 */

export default class Applier {
  constructor(options) {
    this.options = createOptions(options);
  }

  /**
   * highlight to range
   * @param {Range} range
   */
  highlightToRange (range) {
    core.splitRangeBoundaries(range);

    const textNodes = core.getEffectiveTextNodes(range);

    if (textNodes.length) {
      textNodes.forEach(textNode => {
        if (!findSelfOrAncestorWithClass(textNode, this.options.className) && !isWhiteSpaceTextNode(textNode)) {
          this.highlightToTextNode(textNode);
        }
      });

      const lastTextNode = textNodes[textNodes.length - 1];
      core.setRange(range, textNodes[0], 0, lastTextNode, lastTextNode.length);

      this.normalize(textNodes, range, false);
    }
  }

  unhighlightToRange (range) {
    core.splitRangeBoundaries(range);

    const textNodes = core.getEffectiveTextNodes(range);

    if (textNodes.length) {
      // split boundaries ancestor with class
      splitBoundariesAncestorWithClass(range, this.options.className);
      textNodes.forEach(textNode => {
        let ancestor = findSelfOrAncestorWithClass(textNode, this.options.className);
        if (ancestor) {
          removeClassToAncestor(ancestor, this.options.className);
        }
      });

    }
  }

  /**
   *
   * @param {Node} textNode
   */
  highlightToTextNode (textNode) {
    const parentNode = textNode.parentNode;
    if (textNode.nodeType === Node.TEXT_NODE) {
      if (
        !hasClass(parentNode, this.options.className) &&
        parentNode.childNodes.length === 1 &&
        parentNode.tagName.toLowerCase() === this.options.tagName &&
        includesAttrs(parentNode, this.options.elAttrs) &&
        includesProps(parentNode, this.options.elProps)
      ) {
        addClass(parentNode, this.options.className);
      } else {
        const el = this.createElement();
        parentNode.insertBefore(el, textNode);
        el.appendChild(textNode);
      }
    }
  }

  createElement () {
    const el = document.createElement(this.options.tagName);
    addClass(el, this.options.className);
    mapAttrs(el, this.options.elAttrs);
    mapProps(el, this.options.elProps);
    return el;
  }

  normalize (textNodes, range, isUndo) {
    let firstNode = textNodes[0], lastNode = textNodes[textNodes.length - 1];

    let currentMerge = null, merges = [];

    let rangeStartNode = firstNode, rangeEndNode = lastNode;
    let rangeStartOffset = 0, rangeEndOffset = lastNode.length;

    const filter = (node) => {
      return (getClass(node) === this.options.className &&
        node.tagName.toLowerCase() === this.options.tagName &&
        includesAttrs(node, this.options.elAttrs) &&
        includesProps(node, this.options.elProps))
    }

    textNodes.forEach(textNode => {
      // go through each textNode and find the mergable node in front of them,
      const precedingNode = getPrecedingMrTextNode(textNode, !isUndo, filter);

      if (precedingNode) {
        // create a Merge object headed by precedingNode
        if (currentMerge == null) {
          currentMerge = new Merge(precedingNode);
          merges.push(currentMerge);
        }
        currentMerge.textNodes.push(textNode);

        if (rangeStartNode === textNode) {
          rangeStartNode = currentMerge.textNodes[0];
          rangeStartOffset = rangeStartNode.length;
        }

        if (rangeEndNode === textNode) {
          rangeEndNode = currentMerge.textNodes[0];
          rangeEndOffset = currentMerge.getLength();
        }

      } else {
        // reset the current Merge object to create a new merge
        currentMerge = null;
      }
    });

    const nextNode = getNextMrTextNode(lastNode, !isUndo, filter);

    if (nextNode) {
      if (currentMerge == null) {
        currentMerge = new Merge(lastNode);
        merges.push(currentMerge);
      }
      currentMerge.textNodes.push(nextNode);
    }

    if (merges.length) {
      merges.forEach(merge => merge.start());

      core.setRange(range, rangeStartNode, rangeStartOffset, rangeEndNode, rangeEndOffset);
    }

  }
}

const getPrecedingMrTextNode = getter(false);

const getNextMrTextNode = getter(true);

function getter (forward) {
  const adjacentPropName = forward ? 'nextSibling' : 'previousSibling';
  const position = forward ? 'firstChild' : 'lastChild';
  return function (textNode, checkParentElement, filter) {

    let adjacentNode = textNode[adjacentPropName], parentNode = textNode.parentNode;

    if (adjacentNode && adjacentNode.nodeType === Node.TEXT_NODE) {
      return adjacentNode
    } else if (checkParentElement) {
      adjacentNode = parentNode[adjacentPropName];
      if (adjacentNode && adjacentNode.nodeType === Node.ELEMENT_NODE) {
        if (filter && !filter(adjacentNode)) {
          return null;
        }
        let adjacentNodeChild = adjacentNode[position];
        if (adjacentNodeChild && adjacentNodeChild.nodeType === Node.TEXT_NODE) {
          return adjacentNodeChild
        }
      }
    }

    return null
  }
}

class Merge {
  /**
   *
   * @param {Node | Text} node
   */
  constructor(node) {
    this.firstTextNode = node.nodeType === Node.ELEMENT_NODE ? node.firstChild : node;
    this.textNodes = [this.firstTextNode];
  }

  start () {
    const textParts = [];
    this.textNodes.forEach((textNode, index) => {
      const parentNode = textNode.parentNode;
      if (index > 0) {
        removeNode(textNode);
        if (!parentNode.hasChildNodes()) {
          removeNode(parentNode);
        }
      }
      textParts.push(textNode.data);
    });

    this.firstTextNode.data = textParts.join('');
    return this.firstTextNode.data;
  }

  getLength () {
    let len = 0;
    this.textNodes.forEach(textNode => {
      len += textNode.length;
    });
    return len;
  }
}

function mapAttrs (el, attrs) {
  each(attrs, function (attrName, attrValue) {
    if (Object.hasOwn(attrs, attrName) && !/^class(?:Name)?$/i.test(attrName)) {
      el.setAttribute(attrName, attrValue);
    }
  });
}

function mapProps (el, props) {
  each(props, function (propName, propValue) {
    if (Object.hasOwn(props, propName)) {
      if (propName === 'className') {
        addClass(el, propValue);
      } else {
        el[propName] = propValue;
      }
    }
  });
}

/**
 *
 * @param {HTMLElement | Node} el
 * @param {Object} attrs
 * @return {true}
 */
function includesAttrs (el, attrs) {
  for (let attrName in attrs) {
    if (Object.hasOwn(attrs, attrName)) {
      if (el.getAttribute(attrName) !== attrs[attrName]) {
        return false;
      }
    }
  }

  return true;
}

/**
 *
 * @param {HTMLElement | Node} el
 * @param {Object} props
 */
function includesProps (el, props) {
  for (let propName in props) {
    if (Object.hasOwn(props, propName)) {
      if (el[propName] !== props[propName]) {
        return false;
      }
    }
  }

  return true;
}

function splitBoundariesAncestorWithClass (range, className) {
  [{ node: range.endContainer, offset: range.endOffset }, { node: range.startContainer, offset: range.startOffset }]
    .forEach(({ node, offset }) => {
      const ancestorWithClass = findSelfOrAncestorWithClass(node, className);
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
export function splitNodeAt (ancestor, descendant, descendantOffset) {

  let newNode, splitAtStart = (descendantOffset === 0);

  if (isCharacterDataNode(descendant)) {
    let index = getNodeIndex(descendant);

    if (descendantOffset === 0) {
      descendantOffset = index;
    } else if (descendantOffset === descendant.data.length) {
      descendantOffset = index + 1;
    }
    descendant = descendant.parentNode;
  }

  if (isSplitPoint(descendant, descendantOffset)) {
    // clone empty node
    newNode = descendant.cloneNode(false);
    if (newNode.hasAttribute('id')) {
      newNode.removeAttribute('id');
    }
    let child, newIndex = 0;
    while ((child = descendant.childNodes[descendantOffset])) {
      // move child to newNode
      moveNode(child, newNode, newIndex++);
    }
    // move newNode to parentNode
    moveNode(newNode, descendant.parentNode, getNodeIndex(descendant) + 1);
  } else if (ancestor !== descendant) {
    newNode = descendant.parentNode;

    // Work out a new split point in the parent node
    let newNodeIndex = getNodeIndex(descendant);

    if (!splitAtStart) {
      newNodeIndex++;
    }
    return splitNodeAt(ancestor, newNode, newNodeIndex);
  }
}

function moveNode (node, newNode, newIndex) {
  if (newIndex === -1) {
    newIndex = newNode.childNodes.length;
  }

  if (newIndex === newNode.childNodes.length) {
    newNode.appendChild(node);
  } else {
    newNode.insertBefore(node, newNode.childNodes[newIndex]);
  }
}

function isSplitPoint(node, offset) {
  // Node.TEXT_NODE
  if (isCharacterDataNode(node)) {
    if (offset === 0) {
      return !!node.previousSibling;
    } else if (offset === node.length) {
      return !!node.nextSibling;
    } else {
      return true;
    }
  }

  // Node.ELEMENT_NODE
  return offset > 0 && offset < node.childNodes.length;
}

function removeClassToAncestor (ancestor, className) {
  console.log(ancestor);
}