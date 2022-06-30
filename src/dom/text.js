'use strict'

import core from '@/core';

/**
 *
 * @param {Node} node
 * @return {boolean}
 */
export function isCharacterDataNode (node) {
  const t = node.nodeType;
  return t === Node.TEXT_NODE || t === Node.COMMENT_NODE || t === Node.CDATA_SECTION_NODE;
}

export function isWhiteSpaceTextNode (textNode) {
  return textNode && textNode.nodeType === Text.TEXT_NODE && core.utils.stripAndCollapse(textNode.data) === '';
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/normalize
 * 规范: range中没有相邻的applier节点
 * @param {Text[]} textNodes - 一个有序的文本节点队列, 这通常应该是从range中遍历出来的.
 * @param {Range} range - Range对象
 * @param {boolean} isUndo
 */
export function normalize (textNodes, range, isUndo) {
  let firstNode = textNodes[0], lastNode = textNodes[textNodes.length - 1];

  let currentMerge = null, merges = [];

  let rangeStartNode = firstNode, rangeEndNode = lastNode;
  let rangeStartOffset = 0, rangeEndOffset = lastNode.length;

  textNodes.forEach(function (textNode) {
    const precedingNode = core.dom.getPrecedingMrTextNode(textNode, !isUndo);
    // 遍历每一个textNode, 找到他们的前面的可合并节点,
    if (precedingNode) {
      // 以precedingNode为首创建merge对象
      if (currentMerge == null) {
        currentMerge = new core.dom.Merge(precedingNode);
        merges.push(currentMerge);
      }
      currentMerge.textNodes.push(textNode);

      if (rangeStartNode === textNode) {
        rangeStartNode = currentMerge.textNodes[0];
        rangeStartOffset = rangeStartNode.length;
      }

      if (rangeEndNode === textNode) {
        rangeEndNode = currentMerge.textNodes[0];
        rangeEndOffset = currentMerge.getLength();
      }

    } else {
      // 重置当前merge对象, 建立新的合并
      currentMerge = null;
    }
  });

  const nextNode = core.dom.getNextMrTextNode(lastNode, !isUndo);
  if (nextNode) {
    if (currentMerge == null) {
      currentMerge = new core.dom.Merge(lastNode);
      merges.push(currentMerge);
    }
    currentMerge.textNodes.push(nextNode);
  }

  if (merges.length) {
    merges.forEach(merge => merge.start());

    range.setStartAndEnd(rangeStartNode, rangeStartOffset, rangeEndNode, rangeEndOffset);
  }

}

/**
 *
 * @param {boolean} forward
 * @return {function(node: Node, checkParentElement?: boolean): Node | Text | null}
 */
function factory (forward) {
  const adjacentPropName = forward ? 'nextSibling' : 'previousSibling';
  const position = forward ? 'firstChild' : 'lastChild';
  return function (textNode, checkParentElement) {

    let adjacentNode = textNode[adjacentPropName], parentNode = textNode.parentNode;

    if (adjacentNode && adjacentNode.nodeType === Node.TEXT_NODE) {
      return adjacentNode
    } else if (checkParentElement) {
      adjacentNode = parentNode[adjacentPropName];
      if (adjacentNode && adjacentNode.nodeType === Node.ELEMENT_NODE && isMergeable(adjacentNode, parentNode)) {
        let adjacentNodeChild = adjacentNode[position];
        if (adjacentNodeChild && adjacentNodeChild.nodeType === Node.TEXT_NODE) {
          return adjacentNodeChild;
        }
      }
    }

    return null
  }
}

/**
 *
 * @param {Node | HTMLElement} adjacentNode
 * @param {Node | HTMLElement} node
 * @return {boolean}
 */
function isMergeable(adjacentNode, node) {
  if (adjacentNode.tagName.toUpperCase() !== node.tagName.toUpperCase()) {
    // isEqual tagName
    return false;
  }

  if (adjacentNode.attributes.length !== node.attributes.length) {
    // isEqual attributes.length
    return false;
  }

  for (let attrs = adjacentNode.attributes, i = attrs.length - 1; i >= 0; --i) {
    if (!node.hasAttribute(attrs[i].name)) {
      // isEqual attrName
      return false;
    }

    if (attrs[i].value !== node.getAttribute(attrs[i].name)) {
      // isEqual attrValue
      return false;
    }
  }

  return true;
}

export const getPrecedingMrTextNode = factory(false);

export const getNextMrTextNode = factory(true);