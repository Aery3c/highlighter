'use strict'

import core from '@/core';
import { getAllRange } from '@/dom';

class CharacterRange {

  constructor(start, end, referenceNode) {
    this.start = start;
    this.end = end;
    this.referenceNode = referenceNode;
    this.isCollapsed = this.start === this.end;
  }

  isEqual (otherCharacterRange) {
    if (this.referenceNode === otherCharacterRange.referenceNode) {
      return this.start === otherCharacterRange.start && this.end === otherCharacterRange.end;
    }

    return core.isEqualRange(this.toRange(), otherCharacterRange.toRange());
  }

  isIntersects (otherCharacterRange) {
    if (this.referenceNode === otherCharacterRange.referenceNode) {
      return this.start < otherCharacterRange.end && this.end > otherCharacterRange.start;
    }

    return core.intersectsRange(this.toRange(), otherCharacterRange.toRange());
  }

  isAdjoin (otherCharacterRange) {
    if (this.referenceNode === otherCharacterRange.referenceNode) {
      return this.start === otherCharacterRange.end || this.end === otherCharacterRange.start
    }

    return core.isAdjoinRange(this.toRange(), otherCharacterRange.toRange());
  }

  union (otherCharacterRange) {
    const unionRange = core.unionRange(this.toRange(), otherCharacterRange.toRange());
    if (unionRange) {
      return CharacterRange.fromRange(unionRange, this.referenceNode);
    }

    return null
  }

  toRange () {
    const range = document.createRange();
    const { start, end } = this;
    range.setStart(this.referenceNode, 0);
    range.collapse(true);

    const nodeIterator = document.createNodeIterator(this.referenceNode, NodeFilter.SHOW_TEXT);
    let textNode, charIndex = 0, nextCharIndex;

    let foundStart = false, foundEnd = false;
    while (!foundEnd && (textNode = nodeIterator.nextNode())) {
      nextCharIndex = charIndex + textNode.length;
      if (!foundStart && start >= charIndex && start <= nextCharIndex) {
        range.setStart(textNode, start - charIndex);
        foundStart = true;
      }

      if (end >= charIndex && end <= nextCharIndex) {
        range.setEnd(textNode, end - charIndex);
        foundEnd = true;
      }
      charIndex = nextCharIndex;
    }

    return range;
  }

  /**
   *
   * @param {Range} range
   * @param {Node} [referenceNode]
   * @return {CharacterRange}
   */
  static fromRange (range, referenceNode) {
    const surroundRange = range.cloneRange();
    surroundRange.selectNodeContents(referenceNode);
    const intersectionRange = core.getIntersectionRange(range, surroundRange);

    let start = 0, end = 0;
    if (intersectionRange) {
      surroundRange.setEnd(intersectionRange.startContainer, intersectionRange.startOffset);
      start = surroundRange.toString().length;
      end = start + intersectionRange.toString().length
    }

    return new CharacterRange(start, end, referenceNode);
  }

  /**
   *
   * @param {Selection} selection
   * @param {Node} [referenceNode]
   * @return {CharacterRange[]}
   */
  static fromSelection (selection, referenceNode) {
    const characterRanges = []
    getAllRange(selection).forEach(range => {
      characterRanges.push(CharacterRange.fromRange(range, referenceNode));
    });

    return characterRanges;
  }
}

export default CharacterRange;