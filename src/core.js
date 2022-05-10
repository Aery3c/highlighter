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
  getNodes: function () {},
  getEffectiveTextNodes: function () {},
  splitBoundaries: function () {},
  /**
   *
   * @param {HTMLElement} [containerElement]
   * @return {{ start: number; end: number; containerElement: HTMLElement }}
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
    return {
      start,
      end,
      containerElement
    }
  },
  setStartAndEnd: function () {},
  intersectionRange: function () {

  },
  /**
   *
   * @param {Range} otherRange
   * @return {boolean}
   */
  isIntersect: function (otherRange) {
    const start = this.compareBoundaryPoints(otherRange.END_TO_START, otherRange);
    const end = this.compareBoundaryPoints(otherRange.START_TO_END, otherRange);

    return start < 0 && end > 0;
  },
  moveToBookmark: function () {},
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