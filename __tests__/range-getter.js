'use strict';

import { HTML_TEST_TEMPLATE } from './constant';
import { gE } from '@/dom';

export function createCollapsedRange () {
  document.body.innerHTML = HTML_TEST_TEMPLATE;

  return document.createRange();
}

/**
 *
 * @return {Range}
 */
export function createSamePointTextNodeRange () {
  document.body.innerHTML = HTML_TEST_TEMPLATE;

  const range = document.createRange();
  const textNode = gE('#b').firstChild;

  range.selectNodeContents(textNode);

  return range;
}

/**
 *
 * @return {Range}
 */
export function createDiffPointTextNodeRange () {
  document.body.innerHTML = HTML_TEST_TEMPLATE;

  const range = document.createRange();

  const startTextNode = gE('#b').firstChild;

  const endTextNode = gE('#b').nextSibling;

  range.setStart(startTextNode, 3);
  range.setEnd(endTextNode, 21);

  return range;
}

/**
 *
 * @return {Range}
 */
export function createStartElementNode () {
  document.body.innerHTML = HTML_TEST_TEMPLATE;

  const range = document.createRange();

  const startNode = gE('#b');

  const endNode = startNode.nextSibling;

  range.setStart(startNode, 0);
  range.setEnd(endNode, 21);

  return range;
}
