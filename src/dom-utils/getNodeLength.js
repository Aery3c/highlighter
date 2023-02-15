// @flow
'use strict'

/**
 * The element node returns the child node length, and the text node returns the text length
 * @param {Node|Text} node
 */

import { isCharacterDataNode } from './isCharacterDataNode';

export function getNodeLength (node: Node): number {
  const t = node.nodeType;
  if (t === Node.ELEMENT_NODE) {
    return node.childNodes.length;
  } else if (isCharacterDataNode(node)) {
    // $FlowIgnore
    return node.length;
  }
  return 0;
}