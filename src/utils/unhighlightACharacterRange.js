'use strict'

import core from '@/core';

/**
 *
 * @param {CharacterRange} characterRange
 * @param {Object} [options]
 */
function unhighlightACharacterRange (characterRange, options) {
  const range = characterRange.toRange();
  core.utils.unappliesToRange(range, options);
}

export default unhighlightACharacterRange;