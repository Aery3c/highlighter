'use strict';

import { it, expect } from '@jest/globals';
import toType from '@/utils/toType';

it('toType', function () {
  expect(toType([])).toBe('array');
  expect(toType('string')).toBe('string');
  expect(toType(Symbol())).toBe('symbol');
  expect(toType(true)).toBe('boolean');
});