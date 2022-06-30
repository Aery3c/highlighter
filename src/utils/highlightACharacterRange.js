'use strict'

import core from '@/core';

/**
 * @param {CharacterRange} characterRange
 * @param {Object} [options]
 */
function highlightACharacterRange (characterRange, options = {}) {
  const range = characterRange.toRange();
  core.utils.appliesToRange(range, options);
}

export default highlightACharacterRange;