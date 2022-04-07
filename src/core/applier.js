'use strict';

import { getRangeBoundaries, updateRangeFromPosition, omit } from '../utils';
import Merge from './merge';
import { addClass, hasClass, moveChildren, splitNodeAt, copyAttributesToElement } from '../dom';

export default class Applier {
  constructor (options = {}) {
    this.className = options.className || 'highlight';
    this.tagName = options.tagName?.toLowerCase() || 'span';
    this.normal = options.normal || true;
    this.removeEmptyElement = options.removeEmptyElement || true;
    this.elProperty = options.elProperty || {};
    this.elAttribute = options.elAttribute || {};
  }

  /**
   *
   * @param {Range} range
   */
  applyToRange (range) {
    const position = getRangeBoundaries(range);
    // split Boundaries
    range.splitBoundaries();

    if (this.removeEmptyElement) {
      range._removeEmptyElements();
    }

    // get all textNode from range
    const textNodes = range.getEffectiveTextNodes();

    if (textNodes.length) {
      textNodes.forEach(textNode => {
        // forEach textNodes and applyTextNode
        if (!this.getSelfOrAncestorWithClass(textNode)) {
          this.applyTextNode(textNode);
        }
      });

      const lastTextNode = textNodes[textNodes.length - 1];
      range.setStartAndEnd(textNodes[0], 0, lastTextNode, lastTextNode.length);

      // normalize mode
      if (this.normal) {
        this.normalize(textNodes, range, true);
      }
    }

    updateRangeFromPosition(range, position);
  }

  /**
   *
   * @param {Range} range
   */
  undoToRange (range) {
    const position = getRangeBoundaries(range);

    range.splitBoundaries();

    const textNodes = range.getEffectiveTextNodes();
    const lastTextNode = textNodes[textNodes.length - 1];

    if (textNodes.length) {
      this.splitAncestorWithClass(range);
      textNodes.forEach(textNode => {
        let ancestorWithClass = this.getSelfOrAncestorWithClass(textNode);
        if (ancestorWithClass) {
          this.undoToAncestor(ancestorWithClass);
        }
      });
      range.setStartAndEnd(textNodes[0], 0, lastTextNode, lastTextNode.length);
    }

    if (this.normal) {
      this.normalize(textNodes, range, true)
    }

    updateRangeFromPosition(range, position);
  }

  /**
   *
   * @param {Node} ancestor
   */
  undoToAncestor (ancestor) {
    moveChildren(ancestor, ancestor.parentNode, true);
  }

  /**
   *
   * @param {Range} range
   * @return {boolean}
   */
  isAppliedToRange (range) {
    if (range.collapsed && range.toString() === '') {
      return !!this.getSelfOrAncestorWithClass(range.commonAncestorContainer);
    } else {
      const textNodes = range.getEffectiveTextNodes();
      for (let i = 0, textNode; (textNode = textNodes[i]); ++i) {
        if (!this.getSelfOrAncestorWithClass(textNode)) {
          return false;
        }
      }
      return true;
    }
  }

  /**
   *
   * @param {HTMLElement | Node} el
   * @return {boolean}
   */
  isElementMergeable (el) {
    const newEl = this.createContainer();
    // align at textContent
    newEl.textContent = el.textContent;
    return el.isEqualNode(newEl);
  }

  getPreviousMergeableTextNode = createAdjacentMergeableTextNodeGetter(false, node => !this.isElementMergeable(node))

  getNextMergeableTextNode = createAdjacentMergeableTextNodeGetter(true, node => !this.isElementMergeable(node))
  /**
   *
   * @param {Node[]} textNodes
   * @param {Range} range
   * @param {boolean} isUndo
   */
  normalize (textNodes, range, isUndo) {
    let firstNode = textNodes[0], lastNode = textNodes[textNodes.length - 1];

    let currentMerge = null, merges = [];

    let rangeStartNode = firstNode, rangeEndNode = lastNode;
    let rangeStartOffset = 0, rangeEndOffset = lastNode.length;

    textNodes.forEach(textNode => {
      // check preceding node need to merge
      const precedingNode = this.getPreviousMergeableTextNode(textNode, isUndo);
      if (precedingNode) {
        if (!currentMerge) {
          currentMerge = new Merge(precedingNode);
          merges.push(currentMerge);
        }
        currentMerge.textNodes.push(textNode);

        if (firstNode === textNode) {
          rangeStartNode = currentMerge.textNodes[0];
          rangeStartOffset = rangeStartNode.length;
        }

        if (lastNode === textNode) {
          rangeEndNode = currentMerge.textNodes[0];
          rangeEndOffset = currentMerge.getNodeLength();
        }

      } else {
        currentMerge = null;
      }
    });

    const nextNode = this.getNextMergeableTextNode(lastNode, isUndo);
    if (nextNode) {
      if (!currentMerge) {
        currentMerge = new Merge(nextNode);
        merges.push(currentMerge);
      }
      currentMerge.textNodes.push(nextNode);
    }

    if (merges.length) {
      merges.forEach(merge => {
        merge.start();
      });

      range.setStartAndEnd(rangeStartNode, rangeStartOffset, rangeEndNode, rangeEndOffset);
    }
  }

  /**
   *
   * @param {Node} textNode
   */
  applyTextNode (textNode) {
    const textNodeParent = textNode.parentNode;
    if (textNodeParent) {
      const el = this.createContainer();
      textNodeParent.insertBefore(el, textNode);
      el.appendChild(textNode);
    }
  }

  /**
   * @return {HTMLElement}
   */
  createContainer () {
    const el = document.createElement(this.tagName);
    this.copyAttributesToElement(this.elAttribute, el);
    addClass(el, this.className);
    return el;
  }

  /**
   *
   * @param {Object} attrs
   * @param {HTMLElement} el
   */
  copyAttributesToElement (attrs, el) {
    attrs = omit(attrs, ['class', 'className']);
    return copyAttributesToElement(attrs, el);
  }

  /**
   *
   * @param {Node} node
   * @return {Node | null}
   */
  getSelfOrAncestorWithClass (node) {
    while (node) {
      if (this.hasClass(node, this.className)) {
        return node;
      }
      node = node.parentNode;
    }
    return null;
  }

  /**
   *
   * @param {Range} range
   */
  splitAncestorWithClass (range) {
    [{ node: range.endContainer, offset: range.endOffset }, { node: range.startContainer, offset: range.startOffset }]
      .forEach(({ node, offset }) => {
        const ancestorWithClass = this.getSelfOrAncestorWithClass(node);
        if (ancestorWithClass) {
          splitNodeAt(ancestorWithClass, node, offset);
        }
      });
  }

  /**
   *
   * @param {Node | HTMLElement} node
   * @param {string} className
   * @return {boolean}
   */
  hasClass (node, className) {
    return node.nodeType === Node.ELEMENT_NODE && hasClass(node, className);
  }
}

/**
 *
 * @param {boolean} forward
 * @param {(node: Node) => boolean} filter
 * @return {function(node: Node, checkParentElement?: boolean): Node | null}
 */
function createAdjacentMergeableTextNodeGetter(forward, filter) {
  const adjacentPropName = forward ? 'nextSibling' : 'previousSibling';
  const position = forward ? 'firstChild' : 'lastChild';
  return function (textNode, checkParentElement) {

    let adjacentNode = textNode[adjacentPropName], parent = textNode.parentNode;

    if (adjacentNode && adjacentNode.nodeType === Node.TEXT_NODE) {
      return adjacentNode
    } else if (checkParentElement) {
      adjacentNode = parent[adjacentPropName];
      if (adjacentNode && adjacentNode.nodeType === Node.ELEMENT_NODE && !filter(adjacentNode)) {
        let adjacentNodeChild = adjacentNode[position];
        if (adjacentNodeChild && adjacentNodeChild.nodeType === Node.TEXT_NODE) {
          return adjacentNodeChild;
        }
      }
    }

    return null
  }
}
