'use strict'

import core from '@/core';

export default class Applier {
  constructor({ className, tagName, elAttrs, elProps, onElementCreate }) {
    this.className = className;
    this.tagName = tagName;
    this.elAttrs = elAttrs;
    this.elProps = elProps;
    this.onElementCreate = onElementCreate;
  }

  /**
   *
   * @param {Range} range
   */
  apply (range) {
    core.utils.appliesToRange(range, this.tagName, this.className, this.elAttrs, this.elProps, this.onElementCreate);
  }

  /**
   *
   * @param {Range} range
   */
  unapply (range) {
    core.utils.unappliesToRange(range, this.className);
  }
}