'use strict'

import core from '@/core';
import stripAndCollapse from './stripAndCollapse';
import isSplitPoint from './isSplitPoint';
import toType from './toType';

const utils = {
  stripAndCollapse,
  isSplitPoint,
  toType
};

core.extend({
  utils,
});

export default utils;