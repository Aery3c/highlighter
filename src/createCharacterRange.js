'use strict'

import core from '@/core';
import CharacterRange from '@/characterRange';

function createCharacterRange (start, end, containerElement) {
  return new CharacterRange(start, end, containerElement);
}

core.extend({
  createCharacterRange
})

export default createCharacterRange;