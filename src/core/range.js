'use strict'

import { isCharacterDataNode, getNodeIndex } from '../dom';

Range.prototype.getNodes = function () {
  // todo
}

/**
 *
 * @return {Text[]}
 */
Range.prototype.getEffectiveTextNodes = function () {
  const textNodes = this.getNodes([ Node.TEXT_NODE ]);

  let start = 0, node;
  while ( (node = textNodes[start]) && !rangeSelectsAnyText(this, node) ) {
    ++start;
  }

  let end = textNodes.length - 1;
  while ( (node = textNodes[end]) && !rangeSelectsAnyText(this, node) ) {
    --end;
  }
  return textNodes.slice(start, end + 1);
}

/** @this Range */
Range.prototype.splitBoundaries = function () {
  let sc = this.startContainer, so = this.startOffset, ec = this.endContainer, eo = this.endOffset;
  const startSameEnd = (sc === ec);
  if (isCharacterDataNode(ec) && eo > 0 && eo < ec.length) {
    ec.splitText(eo);
  }

  if (isCharacterDataNode(sc) && so > 0 && so < sc.length) {
    sc = sc.splitText(so);
    if (startSameEnd) {
      eo -= so;
      ec = sc;
    } else if (ec === sc.parentNode && eo < getNodeIndex(ec)) {
      eo++;
    }
    so = 0;
  }
}

/**
 *
 * @param {HTMLElement} containerElement
 * @return {BookMark}
 */
Range.prototype.getBookmark = function (containerElement) {
  const surroundRange = this.cloneRange();
  let start = 0, end = 0;
  surroundRange.selectNodeContents(containerElement);
  const range = this.intersectionRange(surroundRange);
  if (range) {
    surroundRange.setEnd(range.startContainer, range.startOffset);
    start = surroundRange.toString().length;
    end = start + range.toString().length
  }
  return {
    start,
    end,
    containerElement
  }
}

/**
 *
 * @param {Range} otherRange
 * @return {Range | null}
 */
Range.prototype.intersectionRange = function (otherRange) {
  if (this.isIntersect(otherRange)) {
    const range = this.cloneRange();
    if (range.compareBoundaryPoints(otherRange.START_TO_START, otherRange) === -1) {
      range.setStart(otherRange.startContainer, otherRange.startOffset);
    }

    if (range.compareBoundaryPoints(otherRange.END_TO_END, otherRange) === 1) {
      range.setEnd(otherRange.endContainer, otherRange.endOffset);
    }

    return range;
  }

  return null;
}

/**
 *
 * @param {Range} otherRange
 * @return {boolean}
 */
Range.prototype.isIntersect = function (otherRange) {
  return rangeIntersect(this, otherRange)
}

/**
 *
 * @param start
 * @param end
 * @param containerElement
 */
Range.prototype.moveToBookmark = function ({ start, end, containerElement }) {
  this.setStart(containerElement, 0);
  this.collapse(true);

  const nodeIterator = document.createNodeIterator(containerElement, NodeFilter.SHOW_TEXT);
  let textNode, charIndex = 0, nextCharIndex;

  let foundStart = false, foundEnd = false;
  while (!foundEnd && (textNode = nodeIterator.nextNode())) {
    nextCharIndex = charIndex + textNode.length;
    if (!foundStart && start >= charIndex && start <= nextCharIndex) {
      this.setStart(textNode, start - charIndex);
      foundStart = true;
    }

    if (end >= charIndex && end <= nextCharIndex) {
      this.setEnd(textNode, end - charIndex);
      foundEnd = true;
    }
    charIndex = nextCharIndex;
  }
}

/**
 *
 * @param {Range} rangeA
 * @param {Range} rangeB
 * @return {boolean}
 */
function rangeIntersect (rangeA, rangeB) {
  const start = rangeA.compareBoundaryPoints(rangeB.END_TO_START, rangeB);
  const end = rangeA.compareBoundaryPoints(rangeB.START_TO_END, rangeB);

  return start < 0 && end > 0;
}

/**
 *
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
