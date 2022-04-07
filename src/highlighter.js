'use strict'
import Applier from './core/applier';

export default class Highlighter {
  constructor(options = {}) {
    this.highlights = [];
    this._applier = new Applier(options);
  }

  /**
   * @param {any} [thing]
   */
  paint (thing) {
    let range;
    if (thing instanceof Selection) {

    } else if (thing instanceof Range) {

    }
  }

}

