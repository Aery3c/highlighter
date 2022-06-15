'use strict'

import core from '@/core';

function isArrayLike( obj ) {

  const length = !!obj && obj.length,
    type = core.utils.toType( obj );

  if ( typeof obj === 'function' || core.dom.isWindow( obj ) ) {
    return false;
  }

  return type === 'array' || length === 0 ||
    typeof length === 'number' && length > 0 && ( length - 1 ) in obj;
}

export default isArrayLike;