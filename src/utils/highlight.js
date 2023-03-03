// @flow
'use strict'

import CharacterRange from './characterRange';
import Refills from '../refills';
import rangeUtils from '../range-utils';
import { compute } from './compute';
import type { Options } from './compute';

type StandardBehaviorOptions = {|
  ...Options;
  behavior: 'auto' | 'smooth';
|}
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

  scrollIntoView (options?: StandardBehaviorOptions | boolean): void {
    let behavior = typeof options === 'boolean' ? undefined : options?.behavior
    compute(this.characterRange.toRange(), getOptions()).forEach(({ el, top, left }) => {
      el.scrollTo({ top, left, behavior });
    });
  }

  getText (): string {
    return this.toRange().toString();
  }

  toRange (): Range {
    return this.characterRange.toRange();
  }
}

function getOptions (alignToTop?: boolean): Options {
  if (alignToTop === false) {
    return { block: 'end', inline: 'nearest' }
  }

  return { block: 'start', inline: 'nearest' }
}