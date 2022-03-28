'use strict';

export default class Highlight {
  /**
   *
   * @param {CharacterRange} characterRange
   * @param {HTMLElement} containerElement
   * @param {string} containerElementId
   */
  constructor(characterRange, containerElement, containerElementId) {
    this.characterRange = characterRange;
    this.containerElement = containerElement;
    this.containerElementId = containerElementId;
  }

  apply () {
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
    console.log(textNodes, 'textNodes');
  }

}
