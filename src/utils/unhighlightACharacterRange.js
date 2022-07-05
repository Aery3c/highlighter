'use strict'

import core from '@/core';

/**
 *
 * @param {CharacterRange} characterRange
 * @param {Object} [options]
 */
function unhighlightACharacterRange (characterRange, options) {
  const defaultOptions = core.utils.getDefaultOptions();
  if (core.utils.toType(options) !== 'object') {
    options = {};
  }

  options = {
    ...defaultOptions,
    ...options
  }

  const range = characterRange.toRange(options.containerElement);
  core.utils.unappliesToRange(range, options.className);
}

export default unhighlightACharacterRange;
