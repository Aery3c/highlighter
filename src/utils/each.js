// @flow
'use strict'

import type { Obj } from '../types';
export function each (obj: Obj, callback: (propName: any, propValue: any) => boolean | void): Obj {
  for (let i in obj) {
    if (callback.call(obj[i], i, obj[i]) === false) {
      break;
    }
  }

  return obj;
}