// @flow
'use strict'

import { RangeIterator, iterateSubtree } from './rangeIterator';
import { getIntersectionRange } from './intersection';

export function getNodes (range: Range, nodeTypes?: Array<number>, filter?: (node: Node) => boolean): Node[] {
  let nodes = [], regx;
  if (nodeTypes && nodeTypes.length) {
    regx = new RegExp(`(${nodeTypes.join('|')})$`);
  }

  iterateSubtree(new RangeIterator(range, false), (node) => {
    if (regx && !regx.test(node.nodeType.toString())) {
      return;
    }

    if (typeof filter == 'function' && !filter(node)) {
      return;
    }

    nodes.push(node);
  });

  return nodes;
}

/**
 * range (prev/next) point (last/first)
 * @param range
 */
export function getEffectiveTextNodes (range: Range): Node[] {
  const textNodes = getNodes(range, [Node.TEXT_NODE]);

  let start = 0, end = textNodes.length, node;

  // remove invalid text nodes from left to right
  while ((node = textNodes[start]) && !rangeSelectsAnyText(range, node)) {
    ++start;
  }

  // remove invalid text nodes from right to left
  while ((node = textNodes[end - 1]) && !rangeSelectsAnyText(range, node)) {
    --end;
  }

  return textNodes.slice(start, end);
}


function rangeSelectsAnyText(range: Range, textNode: Node): boolean {
  const textNodeRange = document.createRange();
  textNodeRange.selectNodeContents(textNode);
  const intersectionRange = getIntersectionRange(textNodeRange, range);
  const text = intersectionRange ? intersectionRange.toString() : '';
  return text !== '';
}
