'use strict'

import core from '@/core';
import stripAndCollapse from './stripAndCollapse';
import isSplitPoint from './isSplitPoint';
import toType from './toType';
import isArrayLike from './isArrayLike';
import highlightACharacterRange from './highlightACharacterRange';
import appliesToRange from './appliesToRange';
import appliesToText from './appliesToText';
import getEffectiveTextNodes from './getEffectiveTextNodes';
import rangeSelectsAnyText from './rangeSelectsAnyText';
import createContainer from './createContainer';
import unhighlightACharacterRange from './unhighlightACharacterRange';
import unappliesToRange from './unappliesToRange';

const utils = {
  stripAndCollapse,
  isSplitPoint,
  toType,
  isArrayLike,
  highlightACharacterRange,
  appliesToRange,
  getEffectiveTextNodes,
  rangeSelectsAnyText,
  appliesToText,
  createContainer,
  unhighlightACharacterRange,
  unappliesToRange
};

core.extend({
  utils,
});

export default utils;