'use strict'

import core from '@/core';
import CharacterRange from '@/characterRange';

/**
 *
 * @param {number} start
 * @param {number} end
 * @returns {CharacterRange}
 */
function createCharacterRange (start = 0, end = 0) {
  return new CharacterRange(start, end);
}

core.extend({
  createCharacterRange
})

export default createCharacterRange;