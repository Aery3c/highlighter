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
  }

  /**
   * add className to then range
   * 给range添加指定的类名
   * @param {Range} range
   */
  applyToRange (range) {
    const pos = getRangeBoundaries(range);
    console.log(pos)
  }

}

/**
 *
 * @param {Range} range
 */
function getRangeBoundaries (range) {
  const pos = range.getBookmark();
  return [...pos];
}