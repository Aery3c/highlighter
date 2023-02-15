// @flow
'use strict'

export function getNodeIndex (node: Node): number {
  let index = 0;
  // $FlowIgnore
  while ((node = node.previousSibling)) {
    index++;
  }

  return index;
}