'use strict'

import core from '@/core';

if (!Text.prototype.splitText) {
  Text.prototype.splitText = function (offset) {
    return splitText(this, offset);
  }
}

/**
 *
 * @param {Text} node
 * @param {number} offset
 * @return {Text}
 */
export function splitText (node, offset) {
  const textNode = document.createTextNode(node.data);
  textNode.deleteData(0, offset);

  node.deleteData(offset, node.length);
  core.dom.insertAfter(textNode, node);

  return textNode;
}

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
 * @param {(adjacentNode: Node) => boolean} [isMergeable]
 */
export function normalize (textNodes, range, isUndo, isMergeable) {
  let firstNode = textNodes[0], lastNode = textNodes[textNodes.length - 1];

  let currentMerge = null, merges = [];

  let rangeStartNode = firstNode, rangeEndNode = lastNode;
  let rangeStartOffset = 0, rangeEndOffset = lastNode.length;

  textNodes.forEach(function (textNode) {
    const precedingNode = core.dom.getPrecedingMrTextNode(textNode, !isUndo, isMergeable);
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

  const nextNode = core.dom.getNextMrTextNode(lastNode, !isUndo, isMergeable);
  if (nextNode) {
    if (currentMerge == null) {
      currentMerge = new core.dom.Merge(lastNode);
      merges.push(currentMerge);
    }
    currentMerge.textNodes.push(nextNode);
  }

  if (merges.length) {
    merges.forEach(merge => merge.start());

    core.setRangeStartAndEnd(range, rangeStartNode, rangeStartOffset, rangeEndNode, rangeEndOffset);
  }

}

/**
 *
 * @param {boolean} forward
 * @return {function(node: Node, checkParentElement?: boolean, isMergeable?: (adjacentNode: Node) => boolean): Node | Text | null}
 */
function factory (forward) {
  const adjacentPropName = forward ? 'nextSibling' : 'previousSibling';
  const position = forward ? 'firstChild' : 'lastChild';
  return function (textNode, checkParentElement, isMergeable) {

    let adjacentNode = textNode[adjacentPropName], parentNode = textNode.parentNode;

    if (adjacentNode && adjacentNode.nodeType === Node.TEXT_NODE) {
      return adjacentNode
    } else if (checkParentElement) {
      adjacentNode = parentNode[adjacentPropName];
      if (adjacentNode && adjacentNode.nodeType === Node.ELEMENT_NODE) {
        if (isMergeable && isMergeable(adjacentNode)) {
          let adjacentNodeChild = adjacentNode[position];
          if (adjacentNodeChild && adjacentNodeChild.nodeType === Node.TEXT_NODE) {
            return adjacentNodeChild
          }
        }
      }
    }

    return null
  }
}

export const getPrecedingMrTextNode = factory(false);

export const getNextMrTextNode = factory(true);
