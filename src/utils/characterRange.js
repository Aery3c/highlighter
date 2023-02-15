// @flow
'use strict'
import rangeUtils from '../range-utils';

export default class CharacterRange {

  start: number;
  end: number;
  referenceNode: Node;
  isCollapsed: boolean;
  constructor(start: number, end: number, referenceNode: Node) {
    this.start = start;
    this.end = end;
    this.referenceNode = referenceNode;
    this.isCollapsed = this.start === this.end;
  }

  _createRelativeCharacterRange (characterRange: CharacterRange): CharacterRange {
    if (characterRange.referenceNode !== this.referenceNode) {
      return CharacterRange.fromRange(characterRange.toRange(), this.referenceNode);
    }

    return characterRange;
  }
  isEqual (another: CharacterRange): boolean {
    another = this._createRelativeCharacterRange(another);
    return this.start === another.start && this.end === another.end;
  }

  isIntersects (another: CharacterRange): boolean {
    another = this._createRelativeCharacterRange(another);
    return this.start < another.end && this.end > another.start;
  }

  isAdjoin (another: CharacterRange): boolean {
    another = this._createRelativeCharacterRange(another);
    return this.start === another.end || this.end === another.start
  }

  union (another: CharacterRange): CharacterRange | null {
    another = this._createRelativeCharacterRange(another);
    if (this.isIntersects(another) || this.isAdjoin(another)) {
      return new CharacterRange(Math.min(this.start, another.start), Math.max(this.end, another.end), this.referenceNode);
    }
    return null
  }

  toRange (): Range {
    const range = document.createRange();
    const { start, end } = this;
    range.setStart(this.referenceNode, 0);
    range.collapse(true);

    const nodeIterator = document.createNodeIterator(this.referenceNode, NodeFilter.SHOW_TEXT);
    let textNode, charIndex = 0, nextCharIndex;

    let foundStart = false, foundEnd = false;
    while (!foundEnd && (textNode = nodeIterator.nextNode()) && textNode) {
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
  static fromRange (range: Range, referenceNode: Node): CharacterRange {
    const wrapRange = range.cloneRange();
    wrapRange.selectNodeContents(referenceNode);

    const intersectionRange = rangeUtils.getIntersectionRange(wrapRange, range);
    let start = 0, end = 0;
    if (intersectionRange) {
      wrapRange.setEnd(intersectionRange.startContainer, intersectionRange.startOffset);
      start = wrapRange.toString().length;
      end = start + intersectionRange.toString().length
    }

    return new CharacterRange(start, end, referenceNode);

  }
  static fromSelection (sel: Selection, referenceNode: HTMLElement | Node): CharacterRange[] {
    const characterRanges = []
    rangeUtils.getRangesInSelection(sel).forEach(range => {
      characterRanges.push(CharacterRange.fromRange(range, referenceNode));
    });

    return characterRanges;
  }
}