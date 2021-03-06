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

class RangeIterator {
  /** @param {Range} range */
  constructor(range) {
    this.range = range;

    if (!this.range.collapsed) {
      this.root = this.range.commonAncestorContainer;
      this.sc = this.range.startContainer;
      this.so = this.range.startOffset;
      this.ec = this.range.endContainer;
      this.eo = this.range.endOffset;

      this._next = this.sc === this.root && !isCharacterDataNode(this.sc)
        ? this.sc.childNodes[this.so] : findClosestAncestor(this.root, this.sc, true)

      this._end = this.ec === this.root && !isCharacterDataNode(this.ec)
        ? this.ec.childNodes[this.eo] : findClosestAncestor(this.root, this.ec, true);
    }

  }

  _current = null;
  _end = null;
  _next = null;

  next () {
    const current = this._current = this._next;
    this._next = this._current != null && this._current !== this._end ? this._current.nextSibling : null;
  }
}

extend(core, {
  splitRangeBoundaries,
  setRange,
  RangeIterator
});

export default core;
