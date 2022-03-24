'use strict'

import { createOptions } from './utils';

const optionPropNames = ['className', 'tagName', 'containerElementId'];

export default class Highlighter {
  constructor(options) {
    options = createOptions(options, {
      className: 'highlight',
      tagName: 'span'
    });
    optionPropNames.forEach(propName => {
      if (Object.prototype.hasOwnProperty.call(options, propName)) {
        this[propName] = options[propName];
      }
    });
  }

  /**
   *
   * @param {Range} range
   * @private
   */
  _apply() {

  }

}
