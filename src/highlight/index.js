'use strict'

import inspect from './inspect';

export default class Highlight {
  /**
   *
   * @param {CharacterRange} characterRange
   * @param {Applier} applier
   */
  constructor(characterRange, applier) {
    this.characterRange = characterRange;
    this.applier = applier;
    this.applied = false;
  }

  /**
   * light self
   */
  apply () {
    const range = this.characterRange.toRange();
    this.applier.applies(range);
    this.applied = true;
  }

  /**
   * dark self
   */
  unapply () {
    const range = this.characterRange.toRange();
    this.applier.unApplies(range);
    this.applied = false;
  }

  /**
   *
   * @param {Node} node
   * @return {boolean}
   */
  containsNode (node) {
    const range = document.createRange();
    range.selectNodeContents(node);
    return this.characterRange.contains(range.getBookmark(this.characterRange.containerElement));
  }

  inspect () {
    inspect(this);
  }
}