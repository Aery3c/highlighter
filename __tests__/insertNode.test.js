'use strict';

/**
 * @jest-environment jsdom
 */

import { expect, test } from '@jest/globals';
import core from '@/core';
import { createContainerRange, createSamePointTextNodeRange } from '@test/range-getter';
import { createTextNode, createElNode } from '@test/node-getter';

test('case 1: insert document fragment', () => {
  const range = createContainerRange();

  const fr = document.createDocumentFragment();

  const text = createTextNode('test-string');
  const span = createElNode('span');
  fr.appendChild(text);
  fr.appendChild(span);

  core.insertNode(range, fr);

  expect(text).toBe(range.startContainer.childNodes[0]);
  expect(span).toBe(range.startContainer.childNodes[1]);
});

test('case 2: insert node', () => {
  const range = createSamePointTextNodeRange();

  // core.insertNode(range, )
});