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
  }

  /**
   * add className to then range
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
  }

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
 *
 * @param {Range} range
 * @return {Text[]}
 */
function getEffectiveTextNodes (range) {
  // todo;
  const textNodes = range.getNodes(NodeFilter.SHOW_TEXT);
  console.log(textNodes);
}