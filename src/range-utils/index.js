// @flow
'use strict'
import { setRange } from './setRange';
import * as intersection from './intersection';
import * as getNodes from './getNodes';
import * as rangeIterator from './rangeIterator';
import { splitRangeBoundaries } from './splitRangeBoundaries';
import * as selection from './selection';

export default {
  ...intersection,
  ...getNodes,
  ...rangeIterator,
  ...selection,
  splitRangeBoundaries,
  setRange
}