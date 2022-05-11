'use strict'

import core from '@/core';
import * as classes from './classes';
import * as text from './text';
import * as node from './node';
import * as get from './get';

const dom = {
  ...classes,
  ...text,
  ...node,
  ...get,
};

core.extend({
  dom
})

export default dom;