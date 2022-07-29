'use strict';

/**
 * @jest-environment jsdom
 */

import { expect, test } from '@jest/globals';
import { HTML_TEST_TEMPLATE } from './constant';
import {
  createSamePointTextNodeRange,
  createDiffPointTextNodeRange,
  createStartElementNode,
  createContainerRange
} from './range-getter';
import { dom } from '@/index';
const {
  gE,
  isCharacterDataNode,
  getNodeIndex,
  getNodeLength,
  findClosestAncestor,
  insertAfter,
  insertPoint,
  isPartiallySelected
} = dom;

document.body.innerHTML = HTML_TEST_TEMPLATE;

test('dom test isCharacterDataNode', ()=> {

  expect(isCharacterDataNode(document.createTextNode('textNode')))
    .toBeTruthy();

  expect(isCharacterDataNode(document.createElement('span')))
    .toBeFalsy();

  expect(new Comment('This is a comment')).toBeTruthy();
});

test('dom test getNodeIndex', () => {
  expect(getNodeIndex(gE('#select-button'))).toBe(3);
});

test('dom test getNodeLength', () => {
  // test element node;
  expect(getNodeLength(gE('#p'))).toBe(3);
  // test text node;
  expect(getNodeLength(gE('#p').childNodes[1].firstChild)).toBe(21);

  // comment node
  expect(getNodeLength(new Comment('comment'))).toBe(7);

  expect(getNodeLength(document)).toBe(0);
});

test('dom test gE', () => {
  expect(gE('#container')).toBeInstanceOf(HTMLElement);
  expect(gE('#random')).toBeNull();
});

test('test findClosestAncestor in same point range', () => {

  const range = createSamePointTextNodeRange();

  expect(findClosestAncestor(range.commonAncestorContainer, range.startContainer)).toBeNull();

  expect(findClosestAncestor(range.commonAncestorContainer, range.endContainer)).toBeNull();
});

test('test findClosestAncestor in diff point range', () => {

  const range = createDiffPointTextNodeRange();

  expect(findClosestAncestor(range.commonAncestorContainer, range.startContainer)).toBe(range.startContainer.parentNode);

  expect(findClosestAncestor(range.commonAncestorContainer, range.endContainer)).toBe(range.endContainer);

});

test('test insertAfter', () => {
  const range = createSamePointTextNodeRange();
  const node = range.startContainer;

  const textNode = node.splitText(3);
  const span = document.createElement('span');
  insertAfter(span, textNode);

  expect(textNode.nextSibling).toBe(span);
});

test('test insertPoint case 1: test are inserted from the middle of the text', () => {
  const range = createSamePointTextNodeRange();
  const textNode = range.startContainer;
  const span = document.createElement('span');

  insertPoint(span, textNode, 3);
  expect(textNode.nextSibling).toBe(span);
  expect(textNode.length).toBe(3); // text is split
});

test('test insertPoint case 2: test are inserted from the end of the text', () => {
  const range = createSamePointTextNodeRange();
  const textNode = range.startContainer;
  const span = document.createElement('span');

  insertPoint(span, textNode, textNode.length);

  expect(textNode.length).toBe(textNode.length); // text is not split

  expect(span.previousSibling).toBe(textNode);
});

test('test insertPoint case 3: test inserts from the middle of the element node', () => {
  const range = createContainerRange();
  const node = range.startContainer;

  const span = document.createTextNode('test');
  insertPoint(span, node, 1)

  expect(node.childNodes[1]).toBe(span);
});

test('test isPartiallySelected', () => {
  const range = createDiffPointTextNodeRange();

  expect(isPartiallySelected(range.startContainer)).toBe(true);

  expect(isPartiallySelected(range.endContainer)).toBe(true);
});