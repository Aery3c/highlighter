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
      if (callback.call( obj[i], i, obj[i]) === false) {
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
  if (typeof range.getBoundingClientRect !== 'function') {
    return range.getBoundingClientRect();
  } else {
    let rect, span = document.createElement('span');
    if (range.collapsed) {
      insertNodeToRange(span, range);
    }
  }
}

/** Range pertinence */

/**
 *
 * @param {Node} node
 * @param {Range} range
 */
function insertNodeToRange (node, range) {
  if (core.dom.isOrIsAncestorOf(node, range.startContainer)) {
    throw new DOMException(`Failed to execute 'insertNode' on 'Range': The new child element contains the parent.`);
  }

  const firstNode = insertNodeAtPosition(node, range.startContainer, range.startOffset);
}

/**
 *
 * @param {Node} node
 * @param {Node} n
 * @param {number} offset
 * @return {Node}
 */
function insertNodeAtPosition (node, n, offset) {
  console.log('insertNodeAtPosition');
  const firstNode = node.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? node.firstChild : node;
  if (core.dom.isCharacterDataNode(n)) {
    if (n.length === offset) {
      core.dom.insertAfter(firstNode, n);
    } else {

    }
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
  if (core.isIntersectionInRange(rangeA, rangeB)) {
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
function isIntersectionInRange (rangeA, rangeB) {
  // rangeA.s < rangeB.e;
  const start = rangeA.compareBoundaryPoints(rangeB.END_TO_START, rangeB);
  // rangeA.e > rangeB.s;
  const end = rangeA.compareBoundaryPoints(rangeB.START_TO_END, rangeB);

  return start < 0 && end > 0;
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

core.extend({
  isPlainObject,
  each,
  getNodesInRange,
  splitRangeBoundaries,
  setRangeStartAndEnd,
  isIntersectionInRange,
  getIntersectionInRange,
  rangeToCharacterRange,
  rangeMoveToCharacterRange,
  getRangeBoundingClientRect,
  getAllRangeInSelection,
  selectionToCharacterRanges
});

export default core;
