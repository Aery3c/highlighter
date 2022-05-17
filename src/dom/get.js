'use strict'

/**
 * 获取node的父辈元素中, 距离ancestor最近的子元素
 *
 * @param {Node} node
 * @param {Node} ancestor
 * @return {Node | null}
 */
export function getClosestAncestorIn (node, ancestor) {
  let p;
  while (node) {
    p = node.parentNode;
    if (p === ancestor) {
      return node;
    }
    node = p;
  }

  return null;
}

/**
 * 传入id 获取dom元素
 * @param {string} selector
 * @returns {HTMLElement}
 */
export function gBEI (selector) {
  if (document.querySelector) {
    return document.querySelector(selector);
  }

  return document.getElementById(selector.match(/[^#]+/).join(''));
}