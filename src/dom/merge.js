/**
 *
 * merge text node
 *
 */

'use strict';

import core from '@/core';

export default class Merge {
  /**
   *
   * @param {Node | Text} node
   */
  constructor(node) {
    this.firstTextNode = node.nodeType === Node.ELEMENT_NODE ? node.firstChild : node;
    this.textNodes = [this.firstTextNode];
  }

  start () {
    const textParts = [];
    this.textNodes.forEach((textNode, index) => {
      const parentNode = textNode.parentNode;
      if (index > 0) {
        core.dom.removeNode(textNode);
        if (!parentNode.hasChildNodes()) {
          core.dom.removeNode(parentNode);
        }
      }
      textParts.push(textNode.data);
    });

    this.firstTextNode.data = textParts.join('');
    return this.firstTextNode.data;
  }

  getLength () {
    let len = 0;
    this.textNodes.forEach(textNode => {
      len += textNode.length;
    });
    return len;
  }

}
