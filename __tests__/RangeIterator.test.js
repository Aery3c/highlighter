'use strict';

/**
 * @jest-environment jsdom
 */

import { HTML_TEST_TEMPLATE } from './constant';
import core from '@/core';
import { gE } from '@/dom';

document.body.innerHTML = HTML_TEST_TEMPLATE;

test('case 1: It starts and ends the same and is a text node. tests start and end as expected', () => {
  const range = document.createRange();

  const textNode = gE('#b').firstChild;

  core.setRange(range, textNode, 0);

  const iterator = new core.RangeIterator(range);

  expect(iterator._next).toBeNull();

  expect(iterator._end).toBeNull();
});
