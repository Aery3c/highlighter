'use strict';
import { addClass, hasClass } from '../dom';
import { updateRangeFromCharacterRange, getNextMergeableTextNode, getPreviousMergeableTextNode } from '../utils';
import Merge from './merge';

export default class Highlight {
  constructor(className, tagName, characterRange, containerElement, containerElementId) {
    this.className = className;
    this.tagName = tagName;
    this.characterRange = characterRange;
    this.containerElement = containerElement;
    this.containerElementId = containerElementId;
    this.applied = false;
  }

  apply () {
    this.applied = true;
    this.applyRange(this.characterRange.getRange());
  }

  /**
   *
   * @param {Range} range
   */
  applyRange (range) {
    // split text
    range.splitBoundaries();

    // get all textNode from range
    const textNodes = range.getEffectiveTextNodes();
    textNodes.forEach(textNode => {
      // forEach textNodes and applyTextNode
      if (this.getSelfOrAncestorWithClass(textNode) == null) {
        this.applyTextNode(textNode);
      }
    });

    const lastTextNode = textNodes[textNodes.length - 1];
    range.setStartAndEnd(textNodes[0], 0, lastTextNode, lastTextNode.length);

    // normal mode
    this.normal(textNodes, range, true);

    updateRangeFromCharacterRange(range, this.characterRange);

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

    // if (merges.length) {
    //   merges.forEach(merge => {
    //     merge.start();
    //   });
    //
    //   range.setStartAndEnd(rangeStartNode, rangeStartOffset, rangeEndNode, rangeEndOffset);
    // }
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
   * @param {Node | HTMLElement} node
   * @param {string} className
   * @return {boolean}
   */
  hasClass (node, className) {
    return node.nodeType === Node.ELEMENT_NODE && hasClass(node, className);
  }
}
