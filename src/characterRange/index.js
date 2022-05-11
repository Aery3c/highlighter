'use strict'

class CharacterRange {
  /**
   *
   * @param {number} start
   * @param {number} end
   * @param {HTMLElement} containerElement
   */
  constructor (start = 0, end = 0, containerElement = document.body) {
    this.start = start;
    this.end = end;
    this.containerElement = containerElement;
  }
}

export default CharacterRange;