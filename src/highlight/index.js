'use strict'

import inspect from './inspect';

export default class Highlight {
  /**
   *
   * @param {CharacterRange} characterRange
   * @param {Applier} applier
   * @param {HTMLElement} containerElement
   */
  constructor(characterRange, applier, containerElement) {
    this.applier = applier;
    this.characterRange = characterRange;
    this.containerElement = containerElement;
    this.applied = false;
  }

  /**
   * light self
   */
  on () {
    this.range = this.characterRange.toRange(this.containerElement);
    this.applier.apply(this.range);
    this.applied = true;
  }

  /**
   * dark self
   */
  off () {
    this.range = this.characterRange.toRange(this.containerElement);
    this.applier.unapply(this.range);
    this.applied = false;
  }

  /**
   *
   * @param {HTMLElement} el
   * @return {boolean}
   */
  containsElement (el) {
    const range = document.createRange();
    range.selectNodeContents(el);
    return this.characterRange.contains(range.toCharacterRange(this.containerElement));
  }

  inspect () {
    inspect(this);
  }
}
