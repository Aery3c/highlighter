'use strict'

import core from '@/core';
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
