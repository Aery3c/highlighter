'use strict'

import core from '@/core';
import RangeIterator from '@/rangeIterator';

/**
 * 创建range迭代器
 * @param {Range} range
 * @param {NodeIterator.whatToShow} whatToShow
 * @param {NodeIterator.filter} [filter]
 * @return {Generator}
 */
function createRangeIterator (range, whatToShow, filter) {
  return new RangeIterator(range, whatToShow, filter).generator();
}

core.extend({
  createRangeIterator
});

export default createRangeIterator;
