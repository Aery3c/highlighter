'use strict'

import core from '@/core';
import Highlight from './highlight';

/**
 *
 * @param {CharacterRange} characterRange
 * @param {Applier} applier
 * @param {HTMLElement} containerElement
 * @return {Highlight}
 */
function createHighlight (characterRange, applier, containerElement) {
  return new Highlight(characterRange, applier, containerElement);
}

core.extend({
  createHighlight,
  Highlight
})

export default createHighlight;