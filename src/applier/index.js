'use strict'

import core from '@/core';
import { addClass } from '@/dom';

/**
 * Applier Object
 */

export default class Applier {
  constructor(options) {
    this.options = options;
  }

  /**
   *
   * @param {Range} range
   */
  highlightToRange (range) {
    core.splitRangeBoundaries(range);
  }

  createWrapElement () {
    const el = document.createElement(this.options.tagName);
    addClass(el, this.options.className);
    return el;
  }
}