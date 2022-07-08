'use strict'

import core from '@/core';

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

export function gE (selector) {
  return document.querySelector(selector);
}

/**
 * 如果node或者node的祖先元素包含className, 返回这个元素, 否则返回null
 * @param {Node | HTMLElement} node
 * @param {string} className
 * @return {null|Node}
 */
export function getSelfOrAncestorWithClass (node, className) {
  while (node) {
    if (core.dom.hasClass(node, className)) {
      return node;
    }
    node = node.parentNode;
  }
  return null;
}

/**
 *
 * @param {Node | Document} node
 * @return {Document}
 */
export function getDoc (node) {
  if (node.nodeType === Node.DOCUMENT_NODE) {
    return node;
  } else if (node.ownerDocument != null) {
    return node.ownerDocument;
  } else {
    throw Error('getDoc: no document found for node');
  }
}

/**
 *
 * @param {Node} node
 */
export function getWin (node) {
  const doc = getDoc(node);
  if (doc.defaultView != null) {
    return doc.defaultView;
  }

  throw Error('getWin: Cannot get a window object for node');
}

export function getScrollPosition (win) {
  let y = 0, x = 0;
}