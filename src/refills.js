// @flow
'use strict'

import type { RefillsOptions, DefaultRefillsOptions } from './types';
import domUtils from './dom-utils';
import rangeUtils from './range-utils';
import { createRefillsOptions } from './utils/createOptions';
import { each } from './utils/each';

export default class Refills {
  options: DefaultRefillsOptions;
  constructor(options?: RefillsOptions) {
    this.options = createRefillsOptions(options);
  }

  appliesToRange (range: Range): void {
    rangeUtils.splitRangeBoundaries(range);

    const textNodes = rangeUtils.getEffectiveTextNodes(range);
    if (textNodes.length) {
      textNodes.forEach(textNode => {
        if (this.options.className && !domUtils.findSelfOrAncestorWithClass(textNode, this.options.className)) {
          this.appliesToTextNode(textNode);
        }
      });

      const lastTextNode = textNodes[textNodes.length - 1];
      // $FlowIgnore
      rangeUtils.setRange(range, textNodes[0], 0, lastTextNode, lastTextNode.length);
      this.normalize(textNodes, range, false);
    }
  }

  appliesToTextNode (textNode: Node): void {
    const parentNode = textNode.parentNode;
    if (textNode.nodeType === Node.TEXT_NODE && parentNode) {
      const el = this.createElement();
      if (el) {
        parentNode.insertBefore(el, textNode);
        el.appendChild(textNode);
      }
    }
  }

  wipeToRange (range: Range): void {
    rangeUtils.splitRangeBoundaries(range);

    const textNodes = rangeUtils.getEffectiveTextNodes(range);

    if (textNodes.length) {
      // split boundaries ancestor with class
      splitBoundariesAncestorWithClass(range, this.options.className);
      textNodes.forEach(textNode => {
        let ancestorWithClass = domUtils.findSelfOrAncestorWithClass(textNode, this.options.className);
        if (ancestorWithClass) {
          this.wipeToAncestor(ancestorWithClass);
        }
      });

      const lastTextNode = textNodes[textNodes.length - 1];
      // $FlowIgnore
      rangeUtils.setRange(range, textNodes[0], 0, lastTextNode, lastTextNode.length);

      this.normalize(textNodes, range, true);
    }
  }

  wipeToAncestor (ancestor: any): void {
    if (this.isEqualNode(ancestor)) {
      let child, index = domUtils.getNodeIndex(ancestor);
      const parentNode = ancestor.parentNode;

      while ((child = ancestor.firstChild)) {
        // move children to sibling
        domUtils.moveNode(child, parentNode, index++);
      }

      domUtils.removeNode(ancestor);
    } else {
      domUtils.removeClass(ancestor, this.options.className);
    }
  }

  createElement (): HTMLElement | null {
    if (this.options.tagName) {
      const el = document.createElement(this.options.tagName);
      if (this.options.className && this.options.elAttrs && this.options.elProps) {
        domUtils.addClass(el, this.options.className);
        // $FlowIgnore
        mapAttrs(el, this.options.elAttrs);
        // $FlowIgnore
        mapProps(el, this.options.elProps);
      }
      return el;
    }

    return null;
  }

  normalize (textNodes: Node[], range: Range, isUndo: boolean): void {
    let firstNode = textNodes[0], lastNode = textNodes[textNodes.length - 1];

    let currentMerge = null, merges = [];

    let rangeStartNode = firstNode, rangeEndNode = lastNode;
    // $FlowIgnore
    let rangeStartOffset = 0, rangeEndOffset = lastNode.length;

    textNodes.forEach(textNode => {
      // go through each textNode and find the mergable node in front of them,
      const precedingNode = getPrecedingMrTextNode(textNode, !isUndo, (node) => {
        return this.isEqualNode(node);
      });

      if (precedingNode) {
        // create a Merge object headed by precedingNode
        if (currentMerge == null) {
          currentMerge = new Merge(precedingNode);
          merges.push(currentMerge);
        }
        // $FlowIgnore
        currentMerge.textNodes.push(textNode);

        if (rangeStartNode === textNode) {
          // $FlowIgnore
          rangeStartNode = currentMerge.textNodes[0];
          // $FlowIgnore
          rangeStartOffset = rangeStartNode.length;
        }

        if (rangeEndNode === textNode) {
          // $FlowIgnore
          rangeEndNode = currentMerge.textNodes[0];
          // $FlowIgnore
          rangeEndOffset = currentMerge.getLength();
        }

      } else {
        // reset the current Merge object to create a new merge
        currentMerge = null;
      }
    });

    const nextNode = getNextMrTextNode(lastNode, !isUndo, (node) => {
      return this.isEqualNode(node);
    });

    if (nextNode) {
      if (currentMerge == null) {
        currentMerge = new Merge(lastNode);
        merges.push(currentMerge);
      }
      // $FlowIgnore
      currentMerge.textNodes.push(nextNode);
    }

    if (merges.length) {
      merges.forEach(merge => merge.start());

      rangeUtils.setRange(range, rangeStartNode, rangeStartOffset, rangeEndNode, rangeEndOffset);
    }
  }

  isEqualNode (node: Node): boolean {
    const newNode = this.createElement();
    if (newNode) {
      return newNode.cloneNode(false).isEqualNode(node.cloneNode(false));
    }
    return false;
  }
}

function mapAttrs (el: HTMLElement, attrs: Object) {
  each(attrs, function (attrName, attrValue) {
    // eslint-disable-next-line no-prototype-builtins
    if (attrs.hasOwnProperty(attrName) && !/^class(?:Name)?$/i.test(attrName)) {
      el.setAttribute(attrName, attrValue);
    }
  });
}

function mapProps (el: HTMLElement, props: Object) {
  each(props, function (propName, propValue) {
    // eslint-disable-next-line no-prototype-builtins
    if (props.hasOwnProperty(propName)) {
      if (propName === 'className') {
        domUtils.addClass(el, propValue);
      } else {
        // $FlowIgnore
        el[propName] = propValue;
      }
    }
  });
}

const getPrecedingMrTextNode = getter(false);

const getNextMrTextNode = getter(true);
function getter (forward: boolean): ((textNode: Node, checkParentElement: boolean, filter?: (node: Node) => boolean) => Node | null) {
  const adjacentPropName = forward ? 'nextSibling' : 'previousSibling';
  const position = forward ? 'firstChild' : 'lastChild';
  return function (textNode, checkParentElement, filter) {
    // $FlowIgnore
    let adjacentNode = textNode[adjacentPropName], parentNode = textNode.parentNode;

    if (adjacentNode && adjacentNode.nodeType === Node.TEXT_NODE) {
      return adjacentNode
    } else if (checkParentElement) {
      // $FlowIgnore
      adjacentNode = parentNode[adjacentPropName];
      if (adjacentNode && adjacentNode.nodeType === Node.ELEMENT_NODE) {
        if (filter && !filter(adjacentNode)) {
          return null;
        }
        let adjacentNodeChild = adjacentNode[position];
        if (adjacentNodeChild && adjacentNodeChild.nodeType === Node.TEXT_NODE) {
          return adjacentNodeChild
        }
      }
    }

    return null
  }
}

function splitBoundariesAncestorWithClass (range: Range, className: string): void {
  [{ node: range.endContainer, offset: range.endOffset }, { node: range.startContainer, offset: range.startOffset }]
    .forEach(({ node, offset }) => {
      const ancestorWithClass = domUtils.findSelfOrAncestorWithClass(node, className);
      if (ancestorWithClass) {
        domUtils.splitNode(ancestorWithClass, node, offset);
      }
    });
}

class Merge {
  firstTextNode: Node;
  textNodes: Node[];
  constructor(node: Node) {
    const n = node.nodeType === Node.ELEMENT_NODE ? node.firstChild : node;
    if (n) {
      this.firstTextNode = n;
      this.textNodes = [n];
    }
  }

  start (): string {
    const textParts = [];
    this.textNodes.forEach((textNode, index) => {
      const parentNode = textNode.parentNode;
      if (index > 0 && parentNode) {
        domUtils.removeNode(textNode);
        if (!parentNode.hasChildNodes()) {
          domUtils.removeNode(parentNode);
        }
      }
      // $FlowIgnore
      textParts.push(textNode.data);
    });
    // $FlowIgnore
    this.firstTextNode.data = textParts.join('');
    return this.firstTextNode.data;
  }

  getLength (): number {
    let len = 0;
    this.textNodes.forEach(textNode => {
      // $FlowIgnore
      len += textNode.length;
    });
    return len;
  }
}