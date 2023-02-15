// @flow
'use strict'

import { hasClass } from './classes';

/**
 *
 * @param {Node} ancestor
 * @param {Node} node
 * @return {Node | null}
 */
export function findClosestAncestor (ancestor: Node, node: Node): Node | null {
  let p;
  while (node) {
    p = node.parentNode;
    if (p === ancestor) {
      return node
    }
    // $FlowIgnore
    node = p;
  }

  return null;
}

/**
 *
 * @param {Node} ancestor
 * @param {Node} descendant
 * @param {boolean} selfIsAncestor
 */
export function isAncestorOf (ancestor: Node, descendant: Node, selfIsAncestor: boolean): boolean {
  let n = selfIsAncestor ? descendant : descendant.parentNode;
  while (n) {
    if (n === ancestor) {
      return true;
    } else {
      n = n.parentNode;
    }
  }
  return false;
}

/**
 *
 * @param {Node} ancestor
 * @param {Node} descendant
 * @return {boolean}
 */
export function isOrIsAncestorOf(ancestor: Node, descendant: Node): boolean {
  return isAncestorOf(ancestor, descendant, true);
}

export function findSelfOrAncestorWithClass (node: Node, className: string): Node | null {
  while (node) {
    // $FlowIgnore
    if (hasClass(node, className)) {
      return node;
    }
    // $FlowIgnore
    node = node.parentNode;
  }
  return null;
}

