'use strict'

import core from '@/core';

/**
 *
 * @param {CharacterRange} characterRange
 * @param {Object} [options]
 */
function unhighlightACharacterRange (characterRange, options) {

  // options = core.utils.createHighlightOptions(options);

  const range = characterRange.toRange(options.containerElement);
  core.utils.unappliesToRange(range, options.className);
}

export default unhighlightACharacterRange;
