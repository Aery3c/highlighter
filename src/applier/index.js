'use strict'

import core from '@/core';
import { addClass, findSelfOrAncestorWithClass, isWhiteSpaceTextNode, hasClass } from '@/dom';

function createOptions (options) {

}

/**
 * Applier Object
 */

export default class Applier {
  constructor(options) {
    this.options = createOptions(options);
  }

  /**
   *
   * @param {Range} range
   */
  highlightToRange (range) {
    core.splitRangeBoundaries(range);

    const textNodes = core.getEffectiveTextNodes(range);

    if (textNodes.length) {
      textNodes.forEach(textNode => {
        if (!findSelfOrAncestorWithClass(textNode, this.options.className) && !isWhiteSpaceTextNode(textNode)) {
          this.highlightToTextNode(textNode);
        }
      });

      const lastTextNode = textNodes[textNodes.length - 1];
      core.setRange(range, textNodes[0], 0, lastTextNode, lastTextNode.length);

      this.normalize();
    }
  }

  /**
   *
   * @param {Node} textNode
   */
  highlightToTextNode (textNode) {
    const parentNode = textNode.parentNode;
    if (textNode.nodeType === Node.TEXT_NODE) {
      if (
        parentNode.childNodes.length === 1 &&
        parentNode.tagName.toLowerCase() === this.options.tagName &&
        containAttrs(parentNode, this.options.elAttrs) &&
        containProps(parentNode, this.options.elProps)
      ) {
        if (!hasClass(parentNode, this.options.className)) {
          addClass(parentNode, this.options.className);
        }
      } else {
        const el = this.createElement();
        parentNode.insertBefore(el, textNode);
        el.appendChild(textNode);
      }
    }
  }

  createElement () {
    const el = document.createElement(this.options.tagName);
    addClass(el, this.options.className);
    return el;
  }

  normalize () {

  }
}

/**
 *
 * @param {HTMLElement | Node} el
 * @param {Object} attrs
 * @return {true}
 */
function containAttrs (el, attrs) {
  for (let attrName in attrs) {
    if (el.getAttribute(attrName) !== attrs[attrName]) {
      return false;
    }
  }

  return true;
}

/**
 *
 * @param {HTMLElement | Node} el
 * @param {Object} props
 */
function containProps (el, props) {

}