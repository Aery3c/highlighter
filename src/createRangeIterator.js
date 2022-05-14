'use strict'

import core from '@/core';
import RangeIterator from '@/rangeIterator';

/**
 * 创建range迭代器
 * @param {Range} range
 * @param {number} whatToShow
 * @param {((node: Node) => number) | {acceptNode(node: Node): number}} [filter]
 * @return {Generator}
 */
function createRangeIterator (range, whatToShow, filter) {
  whatToShow = whatToShow || NodeFilter.SHOW_ALL;
  return new RangeIterator(range, whatToShow, filter).generator();
}

core.extend({
  createRangeIterator
});

export default createRangeIterator;
