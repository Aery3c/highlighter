/**
 * @license MIT
 *
 * Includes https://github.com/timdown/rangy/blob/master/lib/rangy-classapplier.js
 *
 * add, remove className on Range
 * 给range添加、删除指定的类名
 *
 */

'use strict'
import core from '@/core';

export default class Applier {

  constructor(className = 'highlight', options = {}) {
    this.className = className;
    this.tagName = options.tagName?.toLowerCase() || 'span';
    this.removeEmptyElement = options.removeEmptyElement ?? false;
    this.elAttr = options.elAttr || {};
    this.elProps = options.elProps || {};
  }

  /**
   * add className to then range
   *
   * 给range添加指定的类名
   * @param {Range} range
   */
  applyToRange (range) {
    // 获取range边界的点
    const points = getRangeBoundaries(range);

    // 分割边界
    range.splitBoundaries();

    // 从range上获取所有的有效文本节点
    const textNodes = getEffectiveTextNodes(range);

    if (textNodes.length) {
      textNodes.forEach(textNode => {
        if (!getSelfOrAncestorWithClass(textNode, this.className)) {
          this.applyToTextNode(textNode);
        }
      });

      const lastTextNode = textNodes[textNodes.length - 1];
      range.setStartAndEnd(textNodes[0], 0, lastTextNode, lastTextNode.length);
    }
  }

  /**
   * add className to then textNode
   *
   * 给文本节点添加指定的类名
   * @param {Node} textNode
   */
  applyToTextNode (textNode) {
    const parentNode = textNode.parentNode;
    if (parentNode && textNode.nodeType === Node.TEXT_NODE) {
      const el = this.createContainer();
      parentNode.insertBefore(el, textNode);
      el.appendChild(textNode);
    }
  }

  /**
   * create surround container
   * @return {HTMLElement}
   */
  createContainer () {
    const el = document.createElement(this.tagName);
    core.dom.addClass(el, this.className);
    return el;
  }

}

/**
 *
 * @param {Node | HTMLElement} node
 * @param {string} className
 * @return {null|Node}
 */
function getSelfOrAncestorWithClass (node, className) {
  while (node) {
    if (core.dom.hasClass(node, className)) {
      return node;
    }
    node = node.parentNode;
  }
  return null;
}

/**
 *
 * @param {Range} range
 */
function getRangeBoundaries (range) {
  const characterRange = range.getBookmark();
  return [characterRange.start, characterRange.end];
}

/**
 * range (prev/next) point (last/first)
 * @param {Range} range
 * @return {Node[]}
 */
function getEffectiveTextNodes (range) {

  const textNodes = range.getNodes(NodeFilter.SHOW_TEXT);
  let start = 0, end = textNodes.length, node;

  // 从左往右排除不被包含在range中的textNode
  while ((node = textNodes[start]) && !rangeSelectsAnyText(range, node)) {
    ++start;
  }

  // 从右往左排除不被包含在range中的textNode
  while ((node = textNodes[end - 1]) && !rangeSelectsAnyText(range, node)) {
    --end;
  }

  return textNodes.slice(start, end);
}

/**
 * 如果textNode被包含在range内，返回true，否则返回false
 * @param {Range} range
 * @param {Text} textNode
 * @return {boolean}
 */
function rangeSelectsAnyText(range, textNode) {
  const textNodeRange = document.createRange();
  textNodeRange.selectNodeContents(textNode);
  const intersectionRange = textNodeRange.intersectionRange(range);
  const text = intersectionRange ? intersectionRange.toString() : '';
  return text !== '';
}
