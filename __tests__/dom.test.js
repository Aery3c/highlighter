'use strict';

/**
 * @jest-environment jsdom
 */

import { HTML_TEST_TEMPLATE } from './constant';
import { gE, isCharacterDataNode, getNodeIndex, getNodeLength } from '@/dom';

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