'use strict'

/**
 *
 * @param {string} selectors
 * @returns {Element | null}
 */
export function getElement(selectors) {
  return document.querySelector(selectors);
}

/**
 *
 * @param {number} x
 * @param {number} y
 * @returns {DOMRect}
 */
export function generateGetBoundingClientRect (x = 0, y = 0) {
  return new DOMRect(x, y, 0, 0)
}