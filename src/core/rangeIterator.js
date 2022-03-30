'use strict'
import { isCharacterDataNode, getClosestAncestorIn, isAncestorOf, getNodeLength } from '../dom';

function isNonTextPartiallySelected(node, range) {
  return node.nodeType !== 3
    && (
      isAncestorOf(node, range.startContainer)
      || isAncestorOf(node, range.endContainer)
    );
}

export default class RangeIterator {
  /**
   *
   * @param range
   * @param [whatToShow]
   * @param [filter]
   */
  constructor(range, whatToShow, filter) {
    this.range = range;
    this.whatToShow = whatToShow || NodeFilter.SHOW_ALL;
    this.filter = filter;

    const [sc, so, ec, eo] = [range.startContainer, range.startOffset, range.endContainer, range.endOffset];
    const root = range.commonAncestorContainer;
    if (!range.collapsed) {
      this._current = (root === sc && !isCharacterDataNode(sc))
        ? sc.childNodes[so] : getClosestAncestorIn(sc, root);

      this._last = (root === ec && !isCharacterDataNode(ec))
        ? ec.childNodes[eo] : getClosestAncestorIn(ec, root);
    }
  }

  *generator () {
    while (this._current) {
      let node, rit, nit
      if (isNonTextPartiallySelected(this._current, this.range)) {
        rit = this.getSubtreeIterator();
        while ((node = rit.next().value)) {
          yield node;
        }
      } else {
        nit = document.createNodeIterator(this._current, this.whatToShow, this.filter);
        while(( node = nit.nextNode() )) {
          yield node;
        }
      }
      this._current = this._current !== this._last ? this._current.nextSibling : null
    }
  }

  getSubtreeIterator () {
    const subRange = document.createRange();
    const current = this._current;
    let sc = current, so = 0, ec = current, eo = getNodeLength(current);

    if (isAncestorOf(current, this.range.startContainer)) {
      sc = this.range.startContainer;
      so = this.range.startOffset;
    }

    if (isAncestorOf(current, this.range.endContainer)) {
      ec = this.range.endContainer;
      eo = this.range.endOffset;
    }

    subRange.setStartAndEnd(sc, so, ec, eo);
    return RangeIterator.createRangeIterator(subRange, this.whatToShow, this.filter);
  }

  /**
   *
   * @param {Range} range
   * @param {number} [whatToShow]
   * @param {NodeFilter} [filter]
   */
  static createRangeIterator (range, whatToShow, filter) {
    return new RangeIterator(range, whatToShow, filter).generator();
  }
}

