'use strict'

import core from '@/core';
import CharacterRange from '@/characterRange';

/**
 *
 * @param {number} start
 * @param {number} end
 * @param {HTMLElement} containerElement
 * @returns {CharacterRange}
 */
function createCharacterRange (start = 0, end = 0, containerElement = document.body) {
  return new CharacterRange(start, end, containerElement);
}

core.extend({
  createCharacterRange
})

export default createCharacterRange;