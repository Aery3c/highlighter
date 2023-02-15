// @flow
'use strict'

import CharacterRange from './characterRange';
import Refills from '../refills';

export default class Highlight {
  characterRange: CharacterRange;
  refills: Refills;
  applied: boolean = false;
  range: Range;
  constructor (characterRange: CharacterRange, refills: Refills) {
    this.characterRange = characterRange;
    this.refills = refills;
  }

  on (): void {
    this.range = this.characterRange.toRange();
    this.refills.appliesToRange(this.range);
    this.applied = true;
  }

  off (): void {
    this.range = this.characterRange.toRange();
    this.refills.wipeToRange(this.range);
    this.applied = false;
  }
}