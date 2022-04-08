'use strict'
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
 * @param {Range} range
 * @return {[number, number]}
 */
export function getRangeBoundaries (range) {
  const { start, end } = range.getBookmark(range.startContainer.ownerDocument.body);
  return [start, end];
}

/**
 *
 * @param {Range} range
 * @param {[number, number]} position
 */
export function updateRangeFromPosition (range, position) {
  const [start, end] = position;
  range.moveToBookmark({ start, end, containerElement: range.startContainer.ownerDocument.body });
}

export function omit(obj, ...keys) {
  const keysToRemove = new Set(keys.flat());

  return Object.fromEntries(
    Object.entries(obj)
      .filter(([k]) => !keysToRemove.has(k))
  );
}
