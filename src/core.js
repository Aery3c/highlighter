'use strict'

import { isCharacterDataNode, getNodeIndex, getNodeLength, findClosestAncestor } from '@/dom';
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

  nodes.forEach(node => {
    insertPoint(node, range.startContainer, range.startOffset);
  });
}

/**
 *
 * @param {Node} newNode
 * @param {Node} referenceNode
 * @param {number} offset
 */
function insertPoint (newNode, referenceNode, offset) {
  if (isCharacterDataNode(referenceNode)) {
    if (offset === referenceNode.length) {

    }
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
        current = current.cloneNode(true).deleteData(this.eo, current.length - this.eo);
      }

      if (current === this.sc) {
        current = current.cloneNode(true).deleteData(0, this.so);
      }
    }

    return current;
  }
}

extend(core, {
  splitRangeBoundaries,
  setRange,
  RangeIterator
});

export default core;
