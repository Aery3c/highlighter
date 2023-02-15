// @flow
'use strict'

import { isCharacterDataNode } from '../dom-utils/isCharacterDataNode';
import { findClosestAncestor, isOrIsAncestorOf } from '../dom-utils/findClosestAncestor';
import { getNodeLength } from '../dom-utils/getNodeLength';
import { setRange } from './setRange';

export class RangeIterator {
  range: Range;
  clonePartiallySelectedTextNodes: boolean;
  root: Node;
  sc: Node;
  so: number;
  ec: Node;
  eo: number;
  _current: Node | null = null;
  _end: Node | null = null;
  _next: Node | null = null;
  constructor(range: Range, clonePartiallySelectedTextNodes?: boolean = false) {
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
  next (): Node | null {
    let current = this._current = this._next;
    // $FlowIgnore
    this._next = this._current != null && this._current !== this._end ? this._current.nextSibling : null;

    // Check for partially selected text nodes
    if (isCharacterDataNode(current) && this.clonePartiallySelectedTextNodes) {
      // clone partially selected text nodes
      // return cloneNode
      if (current === this.ec) {
        // $FlowIgnore
        (current = current.cloneNode(true)).deleteData(this.eo, current.length - this.eo);
      }

      if (current === this.sc) {
        // $FlowIgnore
        (current = current.cloneNode(true)).deleteData(0, this.so);
      }
    }

    return current;
  }

  isPartiallySelectedSubtree (): boolean {
    return !isCharacterDataNode(this._current) &&
      // $FlowIgnore
      (isOrIsAncestorOf(this._current, this.sc) || isOrIsAncestorOf(this._current, this.ec));
  }

  getSubtreeIterator (): RangeIterator {
    const range = document.createRange(), current = this._current;
    // $FlowIgnore
    let startContainer = current, startOffset = 0, endContainer = current, endOffset = getNodeLength(current);

    if (current) {
      if (isOrIsAncestorOf(current, this.sc)) {
        startContainer = this.sc;
        startOffset = this.so;
      }
      if (isOrIsAncestorOf(current, this.ec)) {
        endContainer = this.ec;
        endOffset = this.eo;
      }
    }

    setRange(range, startContainer, startOffset, endContainer, endOffset);

    return new RangeIterator(range, this.clonePartiallySelectedTextNodes);
  }
}

export function iterateSubtree (it: RangeIterator, cb: (node: Node) => void) {
  let node;
  while((node = it.next())) {
    if (it.isPartiallySelectedSubtree()) {
      const subIt = it.getSubtreeIterator();
      iterateSubtree(subIt, cb);
    } else {
      const nit = document.createNodeIterator(node);
      while((node = nit.nextNode())) {
        cb(node);
      }
    }
  }
}