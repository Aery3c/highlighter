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

export function range (start = 0, end = 0, step = 1, fromRight) {
  let index = -1
  let length = Math.max(Math.ceil((end - start) / (step || 1)), 0)
  const result = new Array(length)

  while (length--) {
    result[fromRight ? length : ++index] = start
    start += step
  }
  return result
}

/**
 *
 * @param {number} needle
 * @param {number[]} haystack
 * @returns {number}
 */
export function findClosest (needle, haystack) {
  return haystack.reduce((a, b) => {
    let aDiff = Math.abs(a - needle);
    let bDiff = Math.abs(b - needle);

    if (aDiff === bDiff) {
      return a > b ? a : b;
    } else {
      return bDiff < aDiff ? b : a;
    }
  });
}
