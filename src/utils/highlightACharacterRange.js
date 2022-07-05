'use strict'

import core from '@/core';

/**
 * @param {CharacterRange} characterRange
 * @param {Object} [options]
 */
function highlightACharacterRange (characterRange, options) {
  const defaultOptions = core.utils.getDefaultOptions();

  if (core.utils.toType(options) !== 'object') {
    options = {};
  }

  options = {
    ...defaultOptions,
    ...options
  }

  const range = characterRange.toRange(options.containerElement);
  core.utils.appliesToRange(range, options.tagName, options.className, options.elAttrs, options.elProps);
}

export default highlightACharacterRange;
