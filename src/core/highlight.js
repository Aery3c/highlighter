'use strict';
import { addClass } from '../dom';

export default class Highlight {
  constructor(className, tagName, characterRange, containerElement, containerElementId) {
    this.className = className;
    this.tagName = tagName;
    this.characterRange = characterRange;
    this.containerElement = containerElement;
    this.containerElementId = containerElementId;
  }

  apply () {
    this.applyRange(this.characterRange.getRange());
  }

  /**
   *
   * @param {Range} range
   */
  applyRange (range) {
    // split text
    range.splitBoundaries();

    // get all textNode from range
    const textNodes = range.getEffectiveTextNodes();

    // applyToTextNodes
    textNodes.forEach(textNode => {
      this.applyTextNode(textNode);
    });

  }

  /**
   *
   * @param {Node} textNode
   */
  applyTextNode (textNode) {
    const textNodeParent = textNode.parentNode;
    if (textNodeParent) {
      const el = this.createWrapperContainer();
    }
  }

  /**
   * @return {HTMLElement}
   */
  createWrapperContainer () {
    const el = document.createElement(this.tagName);
    addClass(el, this.className);
    return el;
  }

}
