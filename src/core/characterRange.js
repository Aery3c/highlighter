'use strict'

export default class CharacterRange {
  /**
   *
   * @param {number} start
   * @param {number} end
   */
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  /**
   *
   * @param {CharacterRange} otherCharRange
   * @return {CharacterRange}
   */
  intersection (otherCharRange) {
    return new CharacterRange(Math.max(this.start, otherCharRange.start), Math.min(this.end, otherCharRange.end));
  }
  /**
   *
   * @param {CharacterRange} otherCharRange
   * @return {boolean}
   */
  isIntersects (otherCharRange) {
    return this.start < otherCharRange.end && this.end > otherCharRange.start;
  }
  /**
   *
   * @param {CharacterRange} otherCharRange
   * @return {boolean}
   */
  isJoint (otherCharRange) {
    return this.start === otherCharRange.end || this.end === otherCharRange.start
  }

  isEqual (otherCharRange) {
    return this.start === otherCharRange.start && this.end === otherCharRange.end;
  }

  /**
   *
   * @param {CharacterRange} otherCharRange
   * @return {CharacterRange}
   *
   */
  union (otherCharRange) {
    return new CharacterRange(Math.min(this.start, otherCharRange.start), Math.max(this.end, otherCharRange.end));
  }

  /**
   *
   * @param {CharacterRange} subCharRange
   * @return {CharacterRange[]}
   */
  complementarySet (subCharRange) {
    const charSet = [];

    if (this.start < subCharRange.start) {
      charSet.push(new CharacterRange(this.start, subCharRange.start));
    }

    if (this.end > subCharRange.end) {
      charSet.push(new CharacterRange(subCharRange.end, this.end));
    }

    return charSet;
  }

  /**
   *
   * @return {Range}
   */
  getRange () {
    return CharacterRange.characterRangeToRange(this);
  }

  toString () {
    return this.getRange().toString();
  }

  /**
   *
   * @param {Range} range
   * @return {CharacterRange}
   */

  static rangeToCharacterRange (range) {
    /** @type {BookMark} */
    const { start, end } = range.getBookmark(document.body);
    return new CharacterRange(start, end);
  }

  static characterRangeToRange (characterRange) {
    const range = document.createRange();
    const { start, end } = characterRange;
    range.moveToBookmark({ start, end, containerElement: document.body });
    return range;
  }

  /**
   *
   * @param {Node} node
   * @return {CharacterRange}
   */
  static nodeToCharacterRange (node) {
    const range = document.createRange();
    range.selectNodeContents(node);
    return CharacterRange.rangeToCharacterRange(range);
  }
}
