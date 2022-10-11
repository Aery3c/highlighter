'use strict'

import toType from './toType';
import Trie from './trie';

const utils = {};

export function extend () {
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

        if (deep && copy && (isPlainObject(copy) ||
          (copyIsArray = Array.isArray(copy)))) {
          src = target[name];

          if (copyIsArray && !Array.isArray(src)) {
            clone = [];
          } else if (!copyIsArray && !isPlainObject(src)) {
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

export function isPlainObject (obj) {
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

export const rnothtmlwhite = /[^\x20\t\r\n\f]+/g;

export function stripAndCollapse( value ) {
  const tokens = value.match(rnothtmlwhite) || [];
  return tokens.join(' ');
}

export function each (obj, callback) {
  for (let i in obj) {
    if (callback.call(obj[i], i, obj[i]) === false) {
      break;
    }
  }

  return obj;
}

export {
  toType,
  Trie
}

extend(utils, {
  extend,
  isPlainObject,
  stripAndCollapse,
  rnothtmlwhite,
  toType,
  each,
  Trie
});

export default utils;
