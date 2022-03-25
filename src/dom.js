'use strict'

/**
 *
 * @param {string} id
 * @return {HTMLElement}
 */
export function getContainerElement (id) {
  return id ? document.getElementById(id) : document.body;
}
