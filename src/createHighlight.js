'use strict'

import core from '@/core';
import Highlight from './highlight';

function createHighlight () {
  return new Highlight();
}

core.extend({
  createHighlight
})

export default createHighlight;