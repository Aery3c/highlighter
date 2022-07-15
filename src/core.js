'use strict'

/** core as highlighter */
let core = {}, extend;

core.VERSION = '1.0.0';
core.CONTEXT = document.body;
core.DEFAULT_CLASS_NAME = 'highlight';
core.TAG_NAME = 'span';
core.event = {
  CLICK: 'highlight:click',
  CREATE: 'highlight:create'
};

extend = core.extend = function () {
  let options, name, src, copy, copyIsArray, clone,
    target = arguments[0] || {},
    i = 1,
    length = arguments.length,
    deep = false;

  if (typeof target === 'boolean') {
    deep = target;

    target = arguments[i] || {};
    i++;
  }

  if (typeof target !== 'object' && typeof target !== 'function') {
    target = {};
  }

  if (i === length) {
    target = this;
    i--;
  }

  for (; i < length; i++) {

    if ((options = arguments[i] ) != null) {

      for (name in options) {
        copy = options[ name ];

        if (name === '__proto__' || target === copy) {
          continue;
        }

        if (deep && copy && (core.isPlainObject(copy) ||
          (copyIsArray = Array.isArray(copy)))) {
          src = target[name];

          if (copyIsArray && !Array.isArray(src)) {
            clone = [];
          } else if (!copyIsArray && !core.isPlainObject(src)) {
            clone = {};
          } else {
            clone = src;
          }
          copyIsArray = false;

          target[name] = extend(deep, clone, copy);

        } else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  }

  return target;
}

function isPlainObject (obj) {
  let proto, Ctor;

  if (!obj || toString.call(obj) !== '[object Object]') {
    return false;
  }

  proto = Object.getPrototypeOf(obj);

  if (!proto) {
    return true;
  }

  Ctor = {}.hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor === 'function' && {}.hasOwnProperty.toString.call(Ctor) === {}.hasOwnProperty.toString.call(Object);
}

function each (obj, callback) {
  let length, i = 0;

  if (core.utils.isArrayLike(obj)) {
    length = obj.length;
    for (; i < length; i++) {
      if (callback.call(obj[i], i, obj[i]) === false) {
        break;
      }
    }
  } else {
    for (i in obj) {
      if (callback.call(obj[i], i, obj[i]) === false) {
        break;
      }
    }
  }

  return obj;
}

/** position */

/**
 *
 * @param {Range} range
 * @return {DOMRect}
 */
function getRangeBoundingClientRect (range) {
  // todo test
  let rect;
  if (typeof range.getBoundingClientRect !== 'function') {
    rect = range.getBoundingClientRect();
  } else {
    const span = document.createElement('span');
    if (range.collapsed) {
      range.insertNode(span);
      rect = span.getBoundingClientRect();
      core.dom.removeNode(span);
    } else {
      const workingRange = range.cloneRange();

      range.collapse(true);
      range.insertNode(span);
      const startRect = span.getBoundingClientRect();
      core.dom.removeNode(span);

      core.collapseToPoint(workingRange, range.endContainer, range.endOffset);
      range.insertNode(span);
      const endRect = span.getBoundingClientRect();
      core.dom.removeNode(span);

      console.log(startRect, endRect);
    }
  }
  console.log(rect);
  console.log(range.getBoundingClientRect());

  return rect;
}

/**
 *
 * @param {Range} range
 * @param {boolean} [toStart]
 */
function collapse (range, toStart = false) {
  if (typeof range.collapse === 'function') {
    range.collapse(toStart);
  } else {
    if (toStart) {
      range.setEnd(range.startContainer, range.startOffset);
    } else {
      range.setStart(range.endContainer, range.endOffset);
    }
  }
}

/**
 *
 * @param {Range} range
 * @param {Node} node
 * @param {number} offset
 */
function collapseToPoint (range, node, offset) {
  range.setStart(node, offset);
  range.setEnd(node, offset);
}

/** Range pertinence */

/**
 *
 * @param {Node} node
 * @param {Range} range
 */
function insertNodeToRange (node, range) {
  if (typeof range.insertNode === 'function') {
    return range.insertNode(node);
  }

  if (core.dom.isOrIsAncestorOf(node, range.startContainer)) {
    throw new DOMException(`Failed to execute 'insertNode' on 'Range': The new child element contains the parent.`);
  }

  const firstNode = insertNodeAtPosition(node, range.startContainer, range.startOffset);
  range.setStartBefore(firstNode);

}

/**
 *
 * @param {Node} node
 * @param {Node | Text} n
 * @param {number} offset
 * @return {Node}
 */
function insertNodeAtPosition (node, n, offset) {
  const firstNode = node.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? node.firstChild : node;
  if (core.dom.isCharacterDataNode(n)) {
    if (n.length === offset) {
      core.dom.insertAfter(firstNode, n);
    } else {
      n.parentNode.insertBefore(firstNode, offset === 0 ? n : n.splitText(offset));
    }
  } else if (offset >= n.childNodes.length) {
    n.parentNode.appendChild(firstNode);
  } else {
    n.parentNode.insertBefore(firstNode, n.childNodes[offset]);
  }

  return firstNode;
}

/**
 *
 * @param {Range} range
 * @param {number} [whatToShow]
 * @param {((node: Node) => number) | {acceptNode(node: Node): number}} [filter]
 * @returns {Node|Text|*[]}
 */
function getNodesInRange (range, whatToShow, filter) {
  let nodes = [], it = core.createRangeIterator(range, whatToShow, filter), node;
  while ((node = it.next().value)) {
    nodes.push(node);
  }
  return nodes;
}

/**
 *
 * @param {Range} range
 */
function splitRangeBoundaries (range) {
  let [sc, so, ec, eo] = [range.startContainer, range.startOffset, range.endContainer, range.endOffset];

  const startSameEnd = (sc === ec);
  if (core.dom.isCharacterDataNode(ec) && eo > 0 && eo < ec.length) {
    ec.splitText(eo);
  }

  if (core.dom.isCharacterDataNode(sc) && so > 0 && so < sc.length) {
    sc = sc.splitText(so);
    if (startSameEnd) {
      eo -= so;
      ec = sc;
    } else if (ec === sc.parentNode && eo < core.dom.getNodeIndex(ec)) {
      eo++;
    }
    so = 0;
  }

  core.setRangeStartAndEnd(range, sc, so, ec, eo);
}

/**
 *
 * @param {Range} range
 */
function setRangeStartAndEnd (range) {
  let sc = arguments[1], so = arguments[2], ec, eo;
  const len = core.dom.getNodeLength(sc);

  switch (arguments.length) {
    case 3:
      ec = sc;
      eo = len;
      break;
    case 4:
      ec = sc;
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
 * 返回该range和另一个range产生交集的部分, 如果没有返回null
 * @param {Range} rangeA
 * @param {Range} rangeB
 */
function getIntersectionInRange (rangeA, rangeB) {
  if (core.intersectsRange(rangeA, rangeB)) {
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
function intersectsRange (rangeA, rangeB) {
  // rangeA.s < rangeB.e;
  const start = rangeA.compareBoundaryPoints(rangeB.END_TO_START, rangeB);
  // rangeA.e > rangeB.s;
  const end = rangeA.compareBoundaryPoints(rangeB.START_TO_END, rangeB);

  return start < 0 && end > 0;
}

/**
 *
 * @param {Node} node
 * @param {Range} range
 * @return {boolean}
 */
function intersectsNode (node, range) {
  if (core.dom.getDoc(node) !== core.dom.getDoc(range.startContainer)) {
    throw new DOMException('WRONG_DOCUMENT_ERR');
  }

  const n = node.parentNode, offset = core.dom.getNodeIndex(node);

}

function comparePoint (node, offset) {

}

/**
 *
 * @param {number} how
 * @param {Range} target
 * @param {Range} source
 */
function compareBoundaryPoints (how, target, source) {
  if (core.utils.toType(how) !== 'number') {
    return -1;
  }
  if (how > 3) {
    throw new DOMException('NotSupportedError');
  }

  if (!(target instanceof Range)) {
    throw new TypeError(`Failed to execute 'compareBoundaryPoints' on 'Range': parameter 2 is not of type 'Range'.`);
  }

  if (!(source instanceof Range)) {
    throw new TypeError(`Failed to execute 'compareBoundaryPoints' on 'Range': parameter 3 is not of type 'Range'.`);
  }

  let t = ['start', 'end', 'end', 'start'], s = ['start', 'start', 'end', 'end'];
  const sourcePrefix = s[how], targetPrefix = t[how];

  return core.comparePoints(target[targetPrefix + 'Container'], target[targetPrefix + 'Offset'], source[sourcePrefix + 'Container'], source[sourcePrefix + 'Offset']);
}

/**
 *
 * @param {Node} nodeA
 * @param {number} offsetA
 * @param {Node} nodeB
 * @param {number} offsetB
 */
function comparePoints (nodeA, offsetA, nodeB, offsetB) {
  let nodeC, childA, childB, n;
  if (nodeA === nodeB) {
    return offsetA === offsetB ? 0 : (offsetA < offsetB) ? -1 : 1;
  } else if ((nodeC = core.dom.getClosestAncestorIn(nodeB, nodeA))) {
    return offsetA <= core.dom.getNodeIndex(nodeC) ? -1 : 1;
  } else if ((nodeC = core.dom.getClosestAncestorIn(nodeA, nodeB))) {
    return core.dom.getNodeIndex(nodeC) < offsetB ? -1 : 1;
  } else {

    const root = core.dom.getClosestCommonAncestorIn(nodeA, nodeB);

    if (!root) {
      throw new Error("comparePoints error: nodes have no common ancestor");
    }

    childA = (root === nodeA) ? root : core.dom.getClosestAncestorIn(nodeA, root);
    childB = (root === nodeB) ? root : core.dom.getClosestAncestorIn(nodeB, root);

    n = root.firstChild;
    while (n) {
      if (n === childA) {
        return -1
      } else if (n === childB) {
        return 1
      }
      n = n.nextSibling;
    }
  }
}

/**
 * @param {Range} r
 * @param {HTMLElement} [containerElement]
 * @return {CharacterRange}
 */
function rangeToCharacterRange (r, containerElement= core.CONTEXT) {
  const cloneRange = r.cloneRange();
  let start = 0, end = 0;
  // 让cloneRange包围整个容器
  cloneRange.selectNodeContents(containerElement);
  // 获取range和cloneRange之间的交集
  const range = core.getIntersectionInRange(r, cloneRange);
  if (range) {
    // 将cloneRange的结尾推送至intersection的开始
    cloneRange.setEnd(range.startContainer, range.startOffset);
    start = cloneRange.toString().length;
    end = start + range.toString().length
  }
  return core.createCharacterRange(start, end);
}

/**
 *
 * @param {Range} range
 * @param {CharacterRange} characterRange
 * @param {HTMLElement} [containerElement]
 */
function rangeMoveToCharacterRange (range, characterRange, containerElement = core.CONTEXT) {
  const {start, end} = characterRange;
  range.setStart(containerElement, 0);
  range.collapse(true);

  const nodeIterator = document.createNodeIterator(containerElement, NodeFilter.SHOW_TEXT);
  let textNode, charIndex = 0, nextCharIndex;

  let foundStart = false, foundEnd = false;
  while (!foundEnd && (textNode = nodeIterator.nextNode())) {
    nextCharIndex = charIndex + textNode.length;
    if (!foundStart && start >= charIndex && start <= nextCharIndex) {
      range.setStart(textNode, start - charIndex);
      foundStart = true;
    }

    if (end >= charIndex && end <= nextCharIndex) {
      range.setEnd(textNode, end - charIndex);
      foundEnd = true;
    }
    charIndex = nextCharIndex;
  }
}

/** Selection pertinence */

/**
 *
 * @param {Selection} sel
 * @return {Range[]}
 */
function getAllRangeInSelection (sel) {
  const ranges = [];
  for (let i = 0; i < sel.rangeCount; ++i) {
    ranges.push(sel.getRangeAt(i));
  }
  return ranges;
}

/**
 *
 * @param {Selection} sel
 * @param {HTMLElement} [containerElement]
 * @return {CharacterRange[]}
 */
function selectionToCharacterRanges (sel, containerElement) {
  const ranges = core.getAllRangeInSelection(sel);
  return ranges.map(range => core.rangeToCharacterRange(range, containerElement));
}


/** range.prototype extend */
if (!Range.prototype.insertNode) {
  Range.prototype.insertNode = function (node) {
    core.insertNodeToRange(node, this);
  }
}

if (!Range.prototype.collapse) {
  Range.prototype.collapse = function (toStart) {
    core.collapse(this, toStart);
  }
}

if (!Range.prototype.compareBoundaryPoints) {
  Range.prototype.compareBoundaryPoints = function (how, range) {
    return core.compareBoundaryPoints(how, this, range);
  }
}

if (!Range.prototype.comparePoint) {
  Range.prototype.comparePoint = function (node, offset) {
    return comparePoint(node, offset);
  }
}

core.extend({
  isPlainObject,
  each,
  getNodesInRange,
  splitRangeBoundaries,
  setRangeStartAndEnd,
  intersectsRange,
  getIntersectionInRange,
  rangeToCharacterRange,
  rangeMoveToCharacterRange,
  getRangeBoundingClientRect,
  collapse,
  comparePoints,
  comparePoint,
  collapseToPoint,
  compareBoundaryPoints,
  insertNodeToRange,
  getAllRangeInSelection,
  selectionToCharacterRanges
});

export default core;
