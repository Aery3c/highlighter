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

    options = core.utils.createHighlightOptions(options);

    this.containerElement = options.containerElement;
    this.tagName = options.tagName;
    this.className = options.className;
    this.elProps = options.elProps;
    this.elAttrs = options.elAttrs;
    this.characterRange = characterRange;
    this.range = this.characterRange.toRange(this.containerElement);
    this.applied = false;

  }

  /**
   * light self
   */
  apply () {
    this.applied = true;
  }

  /**
   * dark self
   */
  unapply () {
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
