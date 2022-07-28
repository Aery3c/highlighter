'use strict';

/**
 * @jest-environment jsdom
 */

import { expect, test } from '@jest/globals';
import { HTML_TEST_TEMPLATE } from './constant';
import { createSamePointTextNodeRange, createDiffPointTextNodeRange } from './range-getter';
import { dom } from '@/index';
const { gE, isCharacterDataNode, getNodeIndex, getNodeLength, findClosestAncestor } = dom;

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

});