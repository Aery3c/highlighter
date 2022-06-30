'use strict'

import core from '@/core';

/**
 * range (prev/next) point (last/first)
 * @param {Range} range
 * @return {Text[]}
 */
function getEffectiveTextNodes (range) {

  /** @type {Text[]} */
  const textNodes = range.getNodes(NodeFilter.SHOW_TEXT);
  let start = 0, end = textNodes.length, node;

  // 从左往右排除不被包含在range中的textNode
  while ((node = textNodes[start]) && !core.utils.rangeSelectsAnyText(range, node)) {
    ++start;
  }

  // 从右往左排除不被包含在range中的textNode
  while ((node = textNodes[end - 1]) && !core.utils.rangeSelectsAnyText(range, node)) {
    --end;
  }

  return textNodes.slice(start, end);
}

export default getEffectiveTextNodes;