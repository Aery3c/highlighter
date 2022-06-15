'use strict'

const class2type = {};
const toString = class2type.toString;

['Object', 'Array', 'Function', 'Date', 'RegExp'].forEach(function (type) {
  class2type[`[object ${type}]`] = type.toLowerCase();
});

function toType( obj ) {
  if ( obj == null ) {
    return obj + '';
  }

  return typeof obj === 'object' ?
    class2type[ toString.call( obj ) ] || 'object' :
    typeof obj;
}

export default toType;
