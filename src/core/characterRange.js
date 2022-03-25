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
   * @param {Range} range
   * @param {HTMLElement} containerElement
   * @return {CharacterRange}
   */

  static fromRange (range, containerElement) {
    /** @type {BookMark} */
    const bookMark = range.getBookMark(containerElement);
    return new CharacterRange(bookMark.start, bookMark.end)
  }
}
