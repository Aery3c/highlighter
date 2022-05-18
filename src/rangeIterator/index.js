'use strict'

import core from '@/core';

export default class RangeIterator {
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/NodeIterator
   * @param {Range} range
   * @param {number} whatToShow
   * @param {((node: Node) => number) | {acceptNode(node: Node): number}} [filter]
   */
  constructor (range, whatToShow = NodeFilter.SHOW_ALL, filter) {
    this.range = range;
    this.whatToShow = whatToShow;
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
          ? ec.childNodes[eo - 1] : core.dom.getClosestAncestorIn(ec, root);
      }
    }
  }

  /**
   * @return {Generator}
   */
  getSubtreeIterator () {
    const range = document.createRange();
    const current = this._current;
    let sc = current, so = 0, ec = current, eo = core.dom.getNodeLength(current);

    if (core.dom.isAncestorOf(current, this.range.startContainer)) {
      sc = this.range.startContainer;
      so = this.range.startOffset;
    }

    if (core.dom.isAncestorOf(current, this.range.endContainer)) {
      ec = this.range.endContainer;
      eo = this.range.endOffset;
    }

    range.setStartAndEnd(sc, so, ec, eo);

    return new RangeIterator(range, this.whatToShow, this.filter).generator();
  }

  *generator () {
    while (this._current) {
      let nit, rit, node;

      if (isNonTextPartiallySelected(this._current, this.range)) {
        rit = this.getSubtreeIterator();
        while ((node = rit.next().value)) {
          yield node;
        }
      } else {
        nit = document.createNodeIterator(this._current, this.whatToShow, this.filter);
        while ((node = nit.nextNode())) {
          yield node;
        }
      }
      this._current = this._current !== this._last ? this._current.nextSibling : null;
    }
  }
}

/**
 *
 * 如果node不是TEXT_NODE且node是range边界节点的祖先节点, 返回true, 否则false
 * @param {Node} node
 * @param {Range} range
 */
function isNonTextPartiallySelected (node, range) {
  return node.nodeType !== Node.TEXT_NODE && (
    core.dom.isAncestorOf(node, range.startContainer) ||
      core.dom.isAncestorOf(node, range.endContainer)
  );
}