/**
 *
 * add, remove className on Range
 * 给range添加、删除指定的类名
 *
 */

'use strict'
import core from '@/core';
import { getPrecedingMrTextNode, getNextMrTextNode } from './createAdjacentMergeableTextNodeGetter';
import Merge from './merge';
import splitNodeAt from './splitNodeAt';

export default class Applier {

  constructor(className = 'highlight', options = {}) {
    this.className = className;
    this.tagName = options.tagName?.toLowerCase() || 'span';
    this.removeEmptyElement = options.removeEmptyElement ?? false;
    this.elAttrs = options.elAttrs || {};
    this.elProps = options.elProps || {};
  }

  /**
   * add className to then range
   *
   * 给range添加指定的类名
   * @param {Range} range
   */
  applyToRange (range) {
    // 获取字符范围
    const characterRange = range.getBookmark();

    // 分割边界
    range.splitBoundaries();

    // 从range上获取所有的有效文本节点
    const textNodes = getEffectiveTextNodes(range);

    if (textNodes.length) {
      textNodes.forEach(textNode => {
        if (!core.dom.getSelfOrAncestorWithClass(textNode, this.className) && !isWhiteSpaceTextNode(textNode)) {
          this.applyToTextNode(textNode);
        }
      });

      const lastTextNode = textNodes[textNodes.length - 1];
      range.setStartAndEnd(textNodes[0], 0, lastTextNode, lastTextNode.length);

      normalize(textNodes, range, false);
    }
    // dom change
    // 从characterRange更新range
    range.moveToBookmark(characterRange);
  }

  /**
   * remove className to then range
   *
   * 从range上删除指定的类
   * @param {Range} range
   */
  undoToRange (range) {
    const characterRange = range.getBookmark();

    // split boundaries
    range.splitBoundaries();

    const textNodes = getEffectiveTextNodes(range);

    if (textNodes.length) {
      // split boundaries ancestor with class
      splitAncestorWithClass(range, this.className);
      textNodes.forEach(textNode => {
        let ancestorWithClass = core.dom.getSelfOrAncestorWithClass(textNode, this.className);
        if (ancestorWithClass) {

        }
      });
    }
  }

  /**
   * add className to then textNode
   *
   * 给文本节点添加指定的类名
   * @param {Node} textNode
   */
  applyToTextNode (textNode) {
    const parentNode = textNode.parentNode;
    if (textNode.nodeType === Node.TEXT_NODE) {
      if (parentNode.childNodes.length === 1) {
        mapAttrsToElement(this.elAttrs, parentNode);
        mapPropsToElement(this.elProps, parentNode);
        core.dom.addClass(parentNode, this.className);
      } else {
        const el = this.createContainer();
        parentNode.insertBefore(el, textNode);
        el.appendChild(textNode);
      }
    }
  }

  undoToAncestor (ancestor) {

  }

  /**
   * create surround container
   * @return {HTMLElement}
   */
  createContainer () {
    const el = document.createElement(this.tagName);
    core.dom.addClass(el, this.className);
    mapAttrsToElement(this.elAttrs, el);
    mapPropsToElement(this.elProps, el);
    return el;
  }
}

/**
 *
 * @param {Range} range
 * @param {string} className
 */
function splitAncestorWithClass (range, className) {
  [{ node: range.endContainer, offset: range.endOffset }, { node: range.startContainer, offset: range.startOffset }]
    .forEach(({ node, offset }) => {
      const ancestorWithClass = core.dom.getSelfOrAncestorWithClass(node, className);
      if (ancestorWithClass) {
        splitNodeAt(ancestorWithClass, node, offset);
      }
    });
}

/**
 *
 * @param {Object} attrs
 * @param {HTMLElement | Node} el
 */
function mapAttrsToElement (attrs, el) {
  for (let key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

/**
 *
 * @param {Object} props
 * @param {HTMLElement | Node} el
 */
function mapPropsToElement (props, el) {
  for (let key in props) {
    el[key] = props[key];
  }
}

/**
 * 如果textNode是空白字符, 返回true, 否则false
 * @param {Text} textNode
 * @return {boolean}
 */
function isWhiteSpaceTextNode (textNode) {
  return textNode && textNode.nodeType === Text.TEXT_NODE && core.utils.stripAndCollapse(textNode.data) === '';
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/normalize
 * 规范: range中没有相邻的applier节点
 * @param {Text[]} textNodes - 一个有序的文本节点队列, 这通常应该是从range中遍历出来的.
 * @param {Range} range - Range对象
 * @param {boolean} isUndo
 */
function normalize (textNodes, range, isUndo) {
  let firstNode = textNodes[0], lastNode = textNodes[textNodes.length - 1];

  let currentMerge = null, merges = [];

  let rangeStartNode = firstNode, rangeEndNode = lastNode;
  let rangeStartOffset = 0, rangeEndOffset = lastNode.length;

  textNodes.forEach(textNode => {
    const precedingNode = getPrecedingMrTextNode(textNode, !isUndo);
    // 遍历每一个textNode, 找到他们的前面的可合并节点,
    if (precedingNode) {
      // 以precedingNode为首创建merge对象
      if (currentMerge == null) {
        currentMerge = new Merge(precedingNode);
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

  const nextNode = getNextMrTextNode(lastNode, !isUndo);
  if (nextNode) {
    if (currentMerge == null) {
      currentMerge = new Merge(lastNode);
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
 * range (prev/next) point (last/first)
 * @param {Range} range
 * @return {Text[]}
 */
function getEffectiveTextNodes (range) {

  /** @type {Text[]} */
  const textNodes = range.getNodes(NodeFilter.SHOW_TEXT);
  let start = 0, end = textNodes.length, node;

  // 从左往右排除不被包含在range中的textNode
  while ((node = textNodes[start]) && !rangeSelectsAnyText(range, node)) {
    ++start;
  }

  // 从右往左排除不被包含在range中的textNode
  while ((node = textNodes[end - 1]) && !rangeSelectsAnyText(range, node)) {
    --end;
  }

  return textNodes.slice(start, end);
}

/**
 * 如果textNode被包含在range内，返回true，否则返回false
 * @param {Range} range
 * @param {Text} textNode
 * @return {boolean}
 */
function rangeSelectsAnyText(range, textNode) {
  const textNodeRange = document.createRange();
  textNodeRange.selectNodeContents(textNode);
  const intersectionRange = textNodeRange.intersectionRange(range);
  const text = intersectionRange ? intersectionRange.toString() : '';
  return text !== '';
}
