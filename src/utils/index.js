'use strict'

import core from '@/core';
import stripAndCollapse from './stripAndCollapse';
import isSplitPoint from './isSplitPoint';
import toType from './toType';
import isArrayLike from './isArrayLike';

const utils = {
  stripAndCollapse,
  isSplitPoint,
  toType,
  isArrayLike
};

core.extend({
  utils,
});

export default utils;