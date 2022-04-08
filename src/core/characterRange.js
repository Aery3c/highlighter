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
   * @return {boolean}
   */
  intersects (otherCharRange) {
    return this.start < otherCharRange.end && this.end > otherCharRange.start;
  }
  /**
   *
   * @param {CharacterRange} otherCharRange
   * @return {boolean}
   */
  isContiguousWith (otherCharRange) {
    return this.start === otherCharRange.end || this.end === otherCharRange.start
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
   * @param {HTMLElement} containerElement
   * @return {CharacterRange}
   */

  static rangeToCharacterRange (range, containerElement) {
    /** @type {BookMark} */
    const { start, end } = range.getBookmark(containerElement);
    return new CharacterRange(start, end);
  }

  static characterRangeToRange (characterRange) {
    const range = document.createRange();
    range.moveToBookmark(characterRange);
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
    return CharacterRange.rangeToCharacterRange(range, node.ownerDocument.body);
  }
}
