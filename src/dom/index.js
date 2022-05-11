'use strict'

import core from '@/core';
import * as classes from './classes';
import * as text from './text';
import * as node from './node';

const dom = {
  ...classes,
  ...text,
  ...node
};

core.extend({
  dom
})

export default dom;