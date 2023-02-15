// @flow
'use strict'

export function isCharacterDataNode (node: Node | null): boolean {
  if (!node) return false;
  const t = node.nodeType;
  return t === Node.TEXT_NODE || t === Node.COMMENT_NODE;
}