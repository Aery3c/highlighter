'use strict';

/**
 *
 * @param {string} [data]
 * @return {Text}
 */
export function createTextNode (data = 'test') {
  return document.createTextNode(data)
}

/**
 * @param {string} [tagName]
 * @return {*}
 */
export function createElNode (tagName = 'span') {
  return document.createElement(tagName);
}