'use strict'

import core from '@/core';
import stripAndCollapse from './stripAndCollapse';
import isSplitPoint from './isSplitPoint';

const utils = {
  stripAndCollapse,
  isSplitPoint
};

core.extend({
  utils,
});

export default utils;