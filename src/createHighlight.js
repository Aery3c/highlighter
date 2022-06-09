'use strict'

import core from '@/core';
import Highlight from './highlight';

/**
 *
 * @param {CharacterRange} characterRange
 * @param {Applier} applier
 * @return {Highlight}
 */
function createHighlight (characterRange, applier) {
  return new Highlight(characterRange, applier);
}

core.extend({
  createHighlight,
  Highlight
})

export default createHighlight;