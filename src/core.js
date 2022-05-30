'use strict'

/** core as highlighter */
let core = {}, extend;

extend = core.extend = function () {
  let options, name, src, copy, copyIsArray, clone,
    target = arguments[ 0 ] || {},
    i = 1,
    length = arguments.length,
    deep = false;

  if ( typeof target === 'boolean' ) {
    deep = target;

    target = arguments[ i ] || {};
    i++;
  }

  if ( typeof target !== 'object' && typeof target !== 'function' ) {
    target = {};
  }

  if ( i === length ) {
    target = this;
    i--;
  }

  for ( ; i < length; i++ ) {

    if ( ( options = arguments[ i ] ) != null ) {

      for ( name in options ) {
        copy = options[ name ];

        if ( name === '__proto__' || target === copy ) {
          continue;
        }

        if ( deep && copy && ( core.isPlainObject( copy ) ||
          ( copyIsArray = Array.isArray( copy ) ) ) ) {
          src = target[ name ];

          if ( copyIsArray && !Array.isArray( src ) ) {
            clone = [];
          } else if ( !copyIsArray && !core.isPlainObject( src ) ) {
            clone = {};
          } else {
            clone = src;
          }
          copyIsArray = false;

          target[ name ] = extend( deep, clone, copy );

        } else if ( copy !== undefined ) {
          target[ name ] = copy;
        }
      }
    }
  }

  return target;
}

core.extend({
  isPlainObject: function (obj) {
    let proto, Ctor;

    if ( !obj || toString.call( obj ) !== '[object Object]' ) {
      return false;
    }

    proto = Object.getPrototypeOf( obj );

    if ( !proto ) {
      return true;
    }

    Ctor = {}.hasOwnProperty.call( proto, 'constructor' ) && proto.constructor;
    return typeof Ctor === 'function' && {}.hasOwnProperty.toString.call( Ctor ) === {}.hasOwnProperty.toString.call(Object);
  }
});

/** Range extend */
extend(Range.prototype, {
  /**
   *
   * @param {number} [whatToShow]
   * @param {((node: Node) => number) | {acceptNode(node: Node): number}} [filter]
   * @returns {Node|Text|*[]}
   */
  getNodes: function (whatToShow, filter) {
    let nodes = [], it = core.createRangeIterator(this, whatToShow, filter), node;
    while ((node = it.next().value)) {
      nodes.push(node);
    }
    return nodes;
  },

  splitBoundaries: function () {
    let [sc, so, ec, eo] = [this.startContainer, this.startOffset, this.endContainer, this.endOffset];
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

    this.setStartAndEnd(sc, so, ec, eo);
  },
  /**
   *
   * @param {HTMLElement} [containerElement]
   * @return {CharacterRange}
   */
  getBookmark: function (containerElement = document.body) {
    const cloneRange = this.cloneRange();
    let start = 0, end = 0;
    // 让cloneRange包围整个容器
    cloneRange.selectNodeContents(containerElement);
    // 获取range和cloneRange之间的交集
    const range = this.intersectionRange(cloneRange);
    if (range) {
      // 将cloneRange的结尾推送至intersection的开始
      cloneRange.setEnd(range.startContainer, range.startOffset);
      start = cloneRange.toString().length;
      end = start + range.toString().length
    }
    return core.createCharacterRange(start, end, containerElement);
  },
  /**
   *
   * @param sc
   * @param so
   * @param ec
   * @param eo
   */
  setStartAndEnd: function (sc, so, ec, eo) {
    this.setStart(sc, so);
    this.setEnd(ec, eo);
  },

  /**
   * 返回该range和另一个range产生交集的部分, 如果没有返回null
   * @param {Range} otherRange
   * @returns {null|Range}
   */
  intersectionRange: function (otherRange) {
    if (this.isIntersect(otherRange)) {
      const range = this.cloneRange();
      if (range.compareBoundaryPoints(otherRange.START_TO_START, otherRange) === -1) {
        range.setStart(otherRange.startContainer, otherRange.startOffset);
      }

      if (range.compareBoundaryPoints(otherRange.END_TO_END, otherRange) === 1) {
        range.setEnd(otherRange.endContainer, otherRange.endOffset);
      }

      return range;
    }

    return null;
  },
  /**
   * range如果与otherRange产生交集, 返回true, 否则返回false
   * @param {Range} otherRange
   * @return {boolean}
   */
  isIntersect: function (otherRange) {
    // range.s < otherRange.e;
    const start = this.compareBoundaryPoints(otherRange.END_TO_START, otherRange);
    // range.e > otherRange.s;
    const end = this.compareBoundaryPoints(otherRange.START_TO_END, otherRange);

    return start < 0 && end > 0;
  },
  /**
   * @param {CharacterRange} characterRange
   */
  moveToBookmark: function (characterRange) {
    const {start, end, containerElement} = characterRange;
    this.setStart(containerElement, 0);
    this.collapse(true);

    const nodeIterator = document.createNodeIterator(containerElement, NodeFilter.SHOW_TEXT);
    let textNode, charIndex = 0, nextCharIndex;

    let foundStart = false, foundEnd = false;
    while (!foundEnd && (textNode = nodeIterator.nextNode())) {
      nextCharIndex = charIndex + textNode.length;
      if (!foundStart && start >= charIndex && start <= nextCharIndex) {
        this.setStart(textNode, start - charIndex);
        foundStart = true;
      }

      if (end >= charIndex && end <= nextCharIndex) {
        this.setEnd(textNode, end - charIndex);
        foundEnd = true;
      }
      charIndex = nextCharIndex;
    }
  },
  _removeEmptyElements: function () {},
});

/** Selection extend */
extend(Selection.prototype, {
  getAllRange: function () {
    const ranges = [];
    for (let i = 0; i < this.rangeCount; ++i) {
      ranges.push(this.getRangeAt(i));
    }
    return ranges;
  },
  isBackward: function () {}
});

export default core;
