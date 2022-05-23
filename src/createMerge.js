/**
 * @license MIT
 *
 * create merge object
 *
 */
'use strict'

import core from '@/core';
import Merge from '@/merge';

function createMerge () {
  return new Merge();
}

core.extend({
  createMerge
})

export default createMerge;
