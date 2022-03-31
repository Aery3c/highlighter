'use strict'

import CharacterRange from './core/characterRange';
import { haveSameClass } from './dom';

/** @typedef {{ characterRange: CharacterRange, isBackward: boolean }[]} Serialized  */

/**
 *
 * @param [options] - options
 * @param [defaults] - defaults
 * @return {{}}
 */
export function createOptions (options, defaults) {
  let params = {};
  if (typeof params === 'object') {
    Object.assign(params, options);
  }
  if (typeof defaults === 'object') {
    Object.assign(params, defaults);
  }

  return params;
}

/**
 *
 * @param {Range} range
 * @param {CharacterRange} characterRange
 */
export function updateRangeFromCharacterRange (range, characterRange) {
  const { startContainer, startOffset, endContainer, endOffset } = characterRange.getRange();
  range.setStartAndEnd(startContainer, startOffset, endContainer, endOffset);
}

/**
 *
 * @param {Selection} selection
 * @param {Serialized} serialized
 */
export function restoreSelection (selection, serialized) {
  selection.removeAllRanges();
  serialized.forEach(({ characterRange }) => {
    const range = characterRange.getRange();
    selection.addRange(range);
  });
}

/**
 *
 * @param {Selection} selection
 * @param {HTMLElement} containerElement
 * @return {{ characterRange: CharacterRange, isBackward: boolean }[]}
 */
export function serializeSelection (selection, containerElement) {
  const selInfos = [];
  const ranges = selection.getAllRange();
  ranges.forEach(range => {
    selInfos.push({
      characterRange: CharacterRange.rangeToCharacterRange(range, containerElement),
      isBackward: selection.isBackward()
    })
  });

  return selInfos;
}

/**
 *
 * @param {boolean} forward
 * @return {function(node: Node, checkParentElement?: boolean): Node | null}
 */
function createAdjacentMergeableTextNodeGetter(forward) {
  const adjacentPropName = forward ? 'nextSibling' : 'previousSibling';
  const position = forward ? 'firstChild' : 'lastChild';
  return function (textNode, checkParentElement) {

    let adjacentNode = textNode[adjacentPropName], parent = textNode.parentNode;

    if (adjacentNode && adjacentNode.nodeType === Node.TEXT_NODE) {
      return adjacentNode
    } else if (checkParentElement) {
      adjacentNode = parent[adjacentPropName];
      if (adjacentNode && adjacentNode.nodeType === Node.ELEMENT_NODE && isElementMergeable(adjacentNode, parent)) {
        let adjacentNodeChild = adjacentNode[position];
        if (adjacentNodeChild && adjacentNodeChild.nodeType === Node.TEXT_NODE) {
          return adjacentNodeChild;
        }
      }
    }

    return null
  }
}

/**
 *
 * @param {HTMLElement} el1
 * @param {HTMLElement} el2
 * @return {boolean}
 */
function isElementMergeable (el1, el2) {
  // todo
  return el1.tagName.toLowerCase() === el2.tagName.toLowerCase() && haveSameClass(el1, el2);
}

export const getPreviousMergeableTextNode = createAdjacentMergeableTextNodeGetter(false);
export const getNextMergeableTextNode = createAdjacentMergeableTextNodeGetter(true);
