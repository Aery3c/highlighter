/**
 * @license MIT
 *
 * merge text node
 *
 */

'use strict'
import core from '@/core';

export default class Merge {
  constructor() {
    /**
     *
     * @type {*[]}
     * @private
     */
    this._textNodes = [];
  }

  start () {
    if (this._textNodes.length) {
      const parts = [];

      this._textNodes.forEach((textNode, index) => {
        const parentNode = textNode.parentNode;
        if (index > 0) {
          // remove node
          core.dom.removeNode(textNode);
          if (!parentNode.hasChildNodes()) {
            core.dom.removeNode(textNode);
          }
        }
        // add to array
        parts.push(textNode.data);
      });
    } else {

    }
  }



  getLength () {

  }

}
