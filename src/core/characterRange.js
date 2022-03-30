'use strict'

export default class CharacterRange {
  /**
   *
   * @param {number} start
   * @param {number} end
   * @param {HTMLElement | Node} containerElement
   */
  constructor(start, end, containerElement) {
    this.start = start;
    this.end = end;
    this.containerElement = containerElement;
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
    return new CharacterRange(start, end, containerElement);
  }

  static characterRangeToRange (characterRange) {
    const range = document.createRange();
    range.moveToBookmark(characterRange);
    return range;
  }

}
