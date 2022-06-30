'use strict'

import core from '@/core';

/**
 *
 * @param {CharacterRange} characterRange
 * @param {Object} [options]
 */
function unhighlightACharacterRange (characterRange, options) {
  const { containerElement = core.CONTEXT, className = core.DEFAULT_CLASS_NAME } = options;
  const range = characterRange.toRange(containerElement);
  core.utils.unappliesToRange(range, className);
}

export default unhighlightACharacterRange;