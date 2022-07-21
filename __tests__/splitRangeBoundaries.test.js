'use strict';

/**
 * @jest-environment jsdom
 */

import core from '@/core';
import { HTML_TEST_TEMPLATE } from './constant';
import { gE, getNodeIndex } from '@/dom';

document.body.innerHTML = HTML_TEST_TEMPLATE;

test('case 1: start node same end node', () => {

  const range = document.createRange();

  const textNode = document.createTextNode('this is text node');

  range.setStart(textNode, 8);
  range.setEnd(textNode, 12);

  core.splitRangeBoundaries(range)

  expect(range.startContainer).toEqual(range.endContainer);

  expect(range.startContainer.data).toBe('text');

  expect(range.endOffset - range.startOffset).toBe(4);

});

test('case 2: start node different end node', () => {
  const start = gE('#select-button').firstChild;
  const end = gE('#deselect-button').firstChild;

  const range = document.createRange();
  range.setStart(start, 7);
  range.setEnd(end, 8);

  core.splitRangeBoundaries(range);

  expect(range.startContainer.data).toBe('paragraph');
  expect(range.endContainer.data).toBe('Deselect');

  expect(range.startOffset).toBe(0);

  expect(range.endOffset).toBe(8);
});

test('case 3: the end node is the parent of the start node', () => {
  const start = gE('#b').firstChild;
  const end = gE('#b');

  const range = document.createRange();

  range.setStart(start, 4);
  range.setEnd(end, 1);

  const endOffset = range.endOffset;

  expect(endOffset - getNodeIndex(range.startContainer)).toBe(1);

  core.splitRangeBoundaries(range);

  expect(endOffset - getNodeIndex(range.startContainer)).toBe(0);

  expect(range.startContainer.data).toBe('the buttons below');
  expect(range.startOffset).toBe(0);

});

test('case 4: range is collapsed', () => {
  const range = document.createRange();

  const textNode = document.createTextNode('this is text node');

  core.setRange(range, textNode, 4, textNode);

  core.splitRangeBoundaries(range);

  expect(range.startContainer.data).toBe('this');

  expect(range.startOffset === range.endOffset).toBeTruthy();
});

test('test setRange', () => {
  const range = document.createRange();

  const textNode = document.createTextNode('this is text node');

  const offset = 5;
  core.setRange(range, textNode, offset);

  expect(range.startContainer === range.endContainer).toBeTruthy();

  expect(range.endOffset - range.startOffset).toBe(textNode.length - offset);

  core.setRange(range, textNode, 5, textNode);

  expect(range.collapsed).toBe(true);
});
