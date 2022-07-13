'use strict'

import core from '@/core';

/**
 * 如果textNode被包含在range内，返回true，否则返回false
 * @param {Range} range
 * @param {Text} textNode
 * @return {boolean}
 */
function rangeSelectsAnyText(range, textNode) {
  const textNodeRange = document.createRange();
  textNodeRange.selectNodeContents(textNode);
  const intersectionRange = core.getIntersectionInRange(textNodeRange, range);
  const text = intersectionRange ? intersectionRange.toString() : '';
  return text !== '';
}

export default rangeSelectsAnyText;
