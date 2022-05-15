'use strict'

import core from '@/core';

export default class RangeIterator {
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/NodeIterator
   * @param {Range} range
   * @param {number} whatToShow
   * @param {((node: Node) => number) | {acceptNode(node: Node): number}} [filter]
   */
  constructor (range, whatToShow, filter) {
    this.range = range;
    this.whatToShow = whatToShow || NodeFilter.SHOW_ALL;
    this.filter = filter;

    const [sc, so, ec, eo] = [range.startContainer, range.startOffset, range.endContainer, range.endOffset];
    const root = range.commonAncestorContainer;
    if (!range.collapsed) {
      if (sc === ec) {
        // range具有相同的边界点
        this._current = this._last = sc;
      } else {
        // 将边界点对齐
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