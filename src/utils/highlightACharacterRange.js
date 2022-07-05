'use strict'

import core from '@/core';

/**
 * @param {CharacterRange} characterRange
 * @param {Object} [options]
 */
function highlightACharacterRange (characterRange, options = {}) {
  // options = core.utils.createHighlightOptions(options);
  const { containerElement, tagName, className, elAttrs, elProps } = options;
  const range = characterRange.toRange(containerElement);
  core.utils.appliesToRange(range, tagName, className, elAttrs, elProps);
}

export default highlightACharacterRange;
