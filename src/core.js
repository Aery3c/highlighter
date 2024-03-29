'use strict'

import { isCharacterDataNode, getNodeIndex, getNodeLength, findClosestAncestor, insertPoint, iterateSubtree, isOrIsAncestorOf } from '@/dom';
import { extend } from '@/utils';

const core = {};

/**
 *
 * @param {Range} range
 */
function splitRangeBoundaries (range) {
  let [sc, so, ec, eo] = [range.startContainer, range.startOffset, range.endContainer, range.endOffset];

  const startSameEnd = (sc === ec);
  if (isCharacterDataNode(ec) && eo > 0 && eo < ec.length) {
    ec.splitText(eo);
  }

  if (isCharacterDataNode(sc) && so > 0 && so < sc.length) {
    sc = sc.splitText(so);
    if (startSameEnd) {
      eo -= so;
      ec = sc;
    } else if (ec === sc.parentNode && eo <= getNodeIndex(sc)) {
      eo++;
    }
    so = 0;
  }

  setRange(range, sc, so, ec, eo);
}

/**
 *
 * @param {Range} range
 */
function setRange (range) {
  let sc = arguments[1], so = arguments[2], ec, eo;
  const len = getNodeLength(sc);

  switch (arguments.length) {
    case 3:
      ec = sc;
      eo = len;
      break;
    case 4:
      ec = arguments[3];
      eo = so;
      break;
    case 5:
      ec = arguments[3];
      eo = arguments[4];
      break;
  }

  range.setStart(sc, so);
  range.setEnd(ec, eo);
}

/**
 *
 * @param {Range} range
 * @param {Node} node
 */
function insertNode (range, node) {
  let nodes = [];
  if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
    nodes = node.childNodes;
  } else {
    nodes = [node];
  }

  let firstNode;
  for (let i = nodes.length, n; (n = nodes[--i]);) {
    firstNode = insertPoint(n, range.startContainer, range.startOffset);
  }

  if (firstNode) {
    range.setStartBefore(firstNode);
  }
}

class RangeIterator {
  /**
   *
   * @param {Range} range
   * @param {boolean} clonePartiallySelectedTextNodes
   */
  constructor(range, clonePartiallySelectedTextNodes) {
    this.range = range;
    this.clonePartiallySelectedTextNodes = clonePartiallySelectedTextNodes;

    if (!this.range.collapsed) {
      this.root = this.range.commonAncestorContainer;
      this.sc = this.range.startContainer;
      this.so = this.range.startOffset;
      this.ec = this.range.endContainer;
      this.eo = this.range.endOffset;

      if (this.sc === this.ec && isCharacterDataNode(this.sc)) {
        this._next = this._end = this.sc;
      } else {
        this._next = this.sc === this.root && !isCharacterDataNode(this.sc)
          ? this.sc.childNodes[this.so] : findClosestAncestor(this.root, this.sc)

        this._end = this.ec === this.root && !isCharacterDataNode(this.ec)
          ? this.ec.childNodes[this.eo - 1] : findClosestAncestor(this.root, this.ec);
      }
    }

  }

  _current = null;
  _end = null;
  _next = null;

  next () {
    let current = this._current = this._next;
    this._next = this._current != null && this._current !== this._end ? this._current.nextSibling : null;

    // Check for partially selected text nodes
    if (isCharacterDataNode(current) && this.clonePartiallySelectedTextNodes) {
      // clone partially selected text nodes
      // return cloneNode
      if (current === this.ec) {
        (current = current.cloneNode(true)).deleteData(this.eo, current.length - this.eo);
      }

      if (current === this.sc) {
        (current = current.cloneNode(true)).deleteData(0, this.so);
      }
    }

    return current;
  }

  isPartiallySelectedSubtree () {
    return !isCharacterDataNode(this._current) &&
      (isOrIsAncestorOf(this._current, this.sc) || isOrIsAncestorOf(this._current, this.ec));
  }

  getSubtreeIterator () {
    const range = document.createRange(), current = this._current;
    let startContainer = current, startOffset = 0, endContainer = current, endOffset = getNodeLength(current);

    if (isOrIsAncestorOf(current, this.sc)) {
      startContainer = this.sc;
      startOffset = this.so;
    }
    if (isOrIsAncestorOf(current, this.ec)) {
      endContainer = this.ec;
      endOffset = this.eo;
    }

    setRange(range, startContainer, startOffset, endContainer, endOffset);

    return new RangeIterator(range, this.clonePartiallySelectedTextNodes);
  }
}


/**
 *
 * @param {Range} range
 * @param {number[]} [nodeTypes]
 * @param {(node: Node) => boolean} [filter]
 * @return {Node[]}
 */
function getNodes (range, nodeTypes, filter) {
  let nodes = [], regx;
  if (nodeTypes && nodeTypes.length) {
    regx = new RegExp(`(${nodeTypes.join('|')})$`);
  }

  iterateSubtree(new RangeIterator(range, false), (node) => {
    if (regx && !regx.test(node.nodeType)) {
      return;
    }

    if (typeof filter == 'function' && !filter(node)) {
      return;
    }

    nodes.push(node);
  });

  return nodes;
}

/**
 * range (prev/next) point (last/first)
 * @param {Range} range
 * @return {Node[]}
 */
function getEffectiveTextNodes (range) {

  const textNodes = getNodes(range, [Node.TEXT_NODE]);
  let start = 0, end = textNodes.length, node;

  // remove invalid text nodes from left to right
  while ((node = textNodes[start]) && !rangeSelectsAnyText(range, node)) {
    ++start;
  }

  // remove invalid text nodes from right to left
  while ((node = textNodes[end - 1]) && !rangeSelectsAnyText(range, node)) {
    --end;
  }

  return textNodes.slice(start, end);
}

/**
 * Exclude empty strings selected by the range
 * @param {Range} range
 * @param {Text} textNode
 * @return {boolean}
 */
function rangeSelectsAnyText(range, textNode) {
  const textNodeRange = document.createRange();
  textNodeRange.selectNodeContents(textNode);
  const intersectionRange = getIntersectionRange(textNodeRange, range);
  const text = intersectionRange ? intersectionRange.toString() : '';
  return text !== '';
}

/**
 * Returns a boolean indicating whether the given Range intersects the Range.
 * @param {Range} rangeA
 * @param {Range} rangeB
 * @return {boolean}
 */
function intersectsRange (rangeA, rangeB) {
  // rangeA.s < rangeB.e;
  const start = rangeA.compareBoundaryPoints(rangeB.END_TO_START, rangeB);
  // rangeA.e > rangeB.s;
  const end = rangeA.compareBoundaryPoints(rangeB.START_TO_END, rangeB);

  return start < 0 && end > 0;
}

/**
 * Returns the part of a specified range that intersects another range
 * @param {Range} rangeA
 * @param {Range} rangeB
 * @return {Range | null}
 */
function getIntersectionRange (rangeA, rangeB) {
  if (intersectsRange(rangeA, rangeB)) {
    const range = rangeA.cloneRange();
    if (range.compareBoundaryPoints(rangeB.START_TO_START, rangeB) === -1) {
      range.setStart(rangeB.startContainer, rangeB.startOffset);
    }

    if (range.compareBoundaryPoints(rangeB.END_TO_END, rangeB) === 1) {
      range.setEnd(rangeB.endContainer, rangeB.endOffset);
    }

    return range;
  }

  return null;
}

/**
 *
 * @param {Range} rangeA
 * @param {Range} rangeB
 * @return {boolean}
 */
function isEqualRange (rangeA, rangeB) {
  if (intersectsRange(rangeA, rangeB)) {
    return rangeA.compareBoundaryPoints(rangeB.START_TO_START, rangeB) === 0 && rangeA.compareBoundaryPoints(rangeB.END_TO_END, rangeB) === 0;
  }

  return false;
}

/**
 *
 * @param {Range} rangeA
 * @param {Range} rangeB
 * @return {boolean}
 */
function isAdjoinRange (rangeA, rangeB) {
  return rangeA.compareBoundaryPoints(rangeB.END_TO_START, rangeB) === 0 || rangeA.compareBoundaryPoints(rangeB.START_TO_END, rangeB) === 0;
}

/**
 *
 * @param {Range} rangeA
 * @param {Range} rangeB
 * @return {Range | null}
 */
function unionRange (rangeA, rangeB) {
  const range = document.createRange();
  if (intersectsRange(rangeA, rangeB) || isAdjoinRange(rangeA, rangeB)) {
    range.setStart(rangeA.startContainer, rangeA.startOffset);
    range.setEnd(rangeA.endContainer, rangeA.endOffset);
    const start = rangeA.compareBoundaryPoints(rangeB.START_TO_START, rangeB);
    const end = rangeA.compareBoundaryPoints(rangeB.END_TO_END, rangeB);

    if (start === 1) {
      range.setStart(rangeB.startContainer, rangeB.startOffset);
    }

    if (end === -1) {
      range.setEnd(rangeB.endContainer, rangeB.endOffset);
    }

    return range;
  }

  return null
}

Range.prototype.inspect = function () {
  // todo
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(this);
}

extend(core, {
  splitRangeBoundaries,
  setRange,
  RangeIterator,
  insertNode,
  getNodes,
  intersectsRange,
  getIntersectionRange,
  getEffectiveTextNodes,
  isEqualRange,
  isAdjoinRange,
  unionRange
});

export default core;
