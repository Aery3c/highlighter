'use strict';

/**
 * @jest-environment jsdom
 */

import { expect, test } from '@jest/globals';
import core from '@/core';
import { createSamePointTextNodeRange, createCollapsedRange, createStartElementNode } from './range-getter';

test ('case 2: range is collapsed', () => {
  const range = createCollapsedRange();

  const it = new core.RangeIterator(range, true);

  expect(it.next()).toBeNull();
});

test('case 2: It starts and ends the same and is a text node. tests start and end as expected', () => {
  const range = createSamePointTextNodeRange();

  const it = new core.RangeIterator(range, false);

  expect(it._next).toBe(range.startContainer);
  expect(it._end).toBe(range.startContainer);

  expect(it.next()).toBe(range.startContainer);

  expect(it.next()).toBeNull();
});

test('case 3: The node is actually an element node', () => {
  const range = createStartElementNode();

  const it = new core.RangeIterator(range, false);

  expect(it.next()).toBe(range.startContainer);

  expect(it.next()).toBe(range.endContainer);

  expect(it.next()).toBeNull();
});
