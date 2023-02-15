// @flow
'use strict'

import CharacterRange from './characterRange';
import Refills from '../refills';
import rangeUtils from '../range-utils';

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

  intersectsNode (node: Node): boolean {
    const range = document.createRange();
    range.selectNodeContents(node);

    return rangeUtils.intersectsRange(this.characterRange.toRange(), range);
  }
}