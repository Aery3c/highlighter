'use strict'

import core from '@/core';

export default class RangeIterator {
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/NodeIterator
   * @param {Range} range
   * @param {NodeIterator.whatToShow} whatToShow
   * @param {NodeIterator.filter} [filter]
   */
  constructor (range, whatToShow, filter) {
    this.range = range;
    this.whatToShow = whatToShow || NodeFilter.SHOW_ALL;
    this.filter = filter;

    const [sc, so, ec, eo] = [range.startContainer, range.startOffset, range.endContainer, range.endOffset];
    const root = range.commonAncestorContainer;
    if (!range.collapsed) {
      if (sc === ec) {
        this._current = this._last = sc;
      } else {
        this._current = (root === sc && !core.dom.isCharacterDataNode(sc))
          ? sc.childNodes[so] : core.dom.getClosestAncestorIn(sc, root);

        this._last = (root === ec && !core.dom.isCharacterDataNode(ec))
          ? ec.childNodes[eo] : core.dom.getClosestAncestorIn(ec, root);
      }
    }
  }

  *generator () {
    // todo
  }
}