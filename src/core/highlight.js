'use strict';
import { addClass, hasClass } from '../dom';
import { updateRangeFromCharacterRange } from '../utils';

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
    textNodes.forEach(textNode => {
      // forEach textNodes and applyTextNode
      if (this.getSelfOrAncestorWithClass(textNode) == null) {
        this.applyTextNode(textNode);
      }
    });

    // infect Adjacent node
    this.infect()

    updateRangeFromCharacterRange(range, this.characterRange);

  }

  infect () {
    // todo
  }

  /**
   *
   * @param {Node} textNode
   */
  applyTextNode (textNode) {
    const textNodeParent = textNode.parentNode;
    if (textNodeParent) {
      const el = this.createWrapperContainer();
      textNodeParent.insertBefore(el, textNode);
      el.appendChild(textNode);
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

  /**
   *
   * @param {Node} node
   * @return {Node | null}
   */
  getSelfOrAncestorWithClass (node) {
    while (node) {
      if (this.hasClass(node, this.className)) {
        return node;
      }
      node = node.parentNode;
    }
    return null;
  }

  /**
   *
   * @param {Node | HTMLElement} node
   * @param {string} className
   * @return {boolean}
   */
  hasClass (node, className) {
    return node.nodeType === Node.ELEMENT_NODE && hasClass(node, className);
  }
}
