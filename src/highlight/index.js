'use strict'

import core from '@/core';
import inspect from './inspect';

export default class Highlight {
  /**
   *
   * @param {CharacterRange} characterRange
   * @param {Object} [options]
   */
  constructor(characterRange, options) {
    this.options = core.utils.createHighlightOptions(options);
    this.characterRange = characterRange;
    this.range = this.characterRange.toRange(this.options.containerElement);
    this.applied = false;
  }

  /**
   * light self
   */
  apply () {
    core.utils.highlightACharacterRange(this.characterRange, this.options);
    this.applied = true;
  }

  /**
   * dark self
   */
  unapply () {
    core.utils.unhighlightACharacterRange(this.characterRange, this.options);
    this.applied = false;
  }

  /**
   *
   * @param {Node} node
   * @return {boolean}
   */
  containsNode (node) {
    // const range = document.createRange();
    // range.selectNodeContents(node);
    // return this.characterRange.contains(range.getBookmark(this.characterRange.containerElement));
  }

  inspect () {
    inspect(this);
  }
}
