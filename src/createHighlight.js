'use strict'

import core from '@/core';
import Highlight from './highlight';

/**
 *
 * @param {CharacterRange} characterRange
 * @param {Object} [options]
 * @return {Highlight}
 */
function createHighlight (characterRange, options) {
  return new Highlight(characterRange, options);
}

core.extend({
  createHighlight,
  Highlight
})

export default createHighlight;