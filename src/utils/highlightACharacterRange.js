'use strict'

import core from '@/core';

/**
 * @param {CharacterRange} characterRange
 * @param {Object} [options]
 */
function highlightACharacterRange (characterRange, options = {}) {
  const {
    tagName = core.TAG_NAME,
    className = core.DEFAULT_CLASS_NAME,
    containerElement = core.CONTEXT,
    elAttrs = {},
    elProps = {}
  } = options;
  const range = characterRange.toRange(containerElement);
  core.utils.appliesToRange(range, tagName, className, elAttrs, elProps);
}

export default highlightACharacterRange;