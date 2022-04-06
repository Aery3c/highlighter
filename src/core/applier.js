'use strict';

import { getNextMergeableTextNode, getPreviousMergeableTextNode } from '../utils';
import Merge from './merge';
import { addClass, hasClass, moveChildren, isAncestorOf, isCharacterDataNode, getNodeIndex } from '../dom';

export default class Applier {
  constructor (options = {}) {
    this.className = options.className;
    this.tagName = options.tagName?.toLowerCase() || 'span';
  }

  /**
   *
   * @param {Range} range
   */
  applyToRange (range) {
    // split Boundaries
    range.splitBoundaries();

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

      // normal mode
      this.normal(textNodes, range, true);
    }
  }

  /**
   *
   * @param {Range} range
   */
  undoToRange (range) {
    // split Boundaries
    range.splitBoundaries();

    // get all textNode from range
    const textNodes = range.getEffectiveTextNodes();

    if (textNodes.length) {
      this.splitAncestorWithClass(range);
      // textNodes.forEach(textNode => {
      //   let ancestorWithClass = this.getSelfOrAncestorWithClass(textNode);
      //   if (ancestorWithClass) {
      //     this.undoToAncestor(ancestorWithClass);
      //   }
      // });

    }

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
   * @param {Node[]} textNodes
   * @param {Range} range
   * @param {boolean} isUndo
   */
  normal (textNodes, range, isUndo) {
    let firstNode = textNodes[0], lastNode = textNodes[textNodes.length - 1];

    let currentMerge = null, merges = [];

    let rangeStartNode = firstNode, rangeEndNode = lastNode;
    let rangeStartOffset = 0, rangeEndOffset = lastNode.length;

    textNodes.forEach(textNode => {
      // check preceding node need to merge
      const precedingNode = getPreviousMergeableTextNode(textNode, isUndo);
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

    const nextNode = getNextMergeableTextNode(lastNode, isUndo);
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
      const el = this.createWrapperContainer();
      textNodeParent.insertBefore(el, textNode);
      el.appendChild(textNode);
    }
  }

  /**
   * @return {HTMLElement}
   */
  createWrapperContainer () {
    const el = document.createElement(this.tagName);
    addClass(el, this.className);
    return el;
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
 * @param {Node} ancestor
 * @param {Node} descendant
 * @param {number} descendantOffset
 */
function splitNodeAt (ancestor, descendant, descendantOffset) {
  let newNode, parentNode;
  let splitAtStart = (descendantOffset === 0);

  if (isAncestorOf(descendant, ancestor)) {
    return ancestor;
  }

  if (isCharacterDataNode(descendant)) {
    const index = getNodeIndex(descendant);
    if (descendantOffset === 0) {
      descendantOffset = index;
    } else if (descendantOffset === descendant.length) {
      descendantOffset += index + 1;
    }
  }

  console.log(descendantOffset, 'descendantOffset');

}
