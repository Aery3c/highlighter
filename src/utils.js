'use strict'

import CharacterRange from './core/characterRange';

/** @typedef {{ characterRange: CharacterRange, isBackward: boolean }[]} Serialized  */

/**
 *
 * @param [options] - options
 * @param [defaults] - defaults
 * @return {{}}
 */
export function createOptions (options, defaults) {
  let params = {};
  if (typeof defaults === 'object') {
    Object.assign(params, defaults);
  }

  if (typeof options === 'object') {
    Object.assign(params, options);
  }

  return params;
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
  const rangeInfos = [];
  const ranges = selection.getAllRange();
  ranges.forEach(range => {
    rangeInfos.push({
      characterRange: CharacterRange.rangeToCharacterRange(range, containerElement),
      isBackward: selection.isBackward()
    })
  });

  return rangeInfos;
}

/**
 *
 * @param {Range} range
 * @return {[number, number]}
 */
export function getRangeBoundaries (range) {
  const { start, end } = range.getBookmark(document.body);
  return [start, end];
}

/**
 *
 * @param {Range} range
 * @param {[number, number]} position
 */
export function updateRangeFromPosition (range, position) {
  const [start, end] = position;
  range.moveToBookmark({ start, end, containerElement: document.body });
}
