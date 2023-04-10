// @flow
'use strict'

import CharacterRange from './characterRange';
import Refills from '../refills';

let nextHighlightId = 1;

export default class Highlight {
	characterRange: CharacterRange;
	refills: Refills;
	applied: boolean;
	highlightId: number;

	constructor(characterRange: CharacterRange, refills: Refills, highlightId: number) {
		this.characterRange = characterRange;
		this.refills = refills;
		this.applied = false;
		if (highlightId) {
      this.highlightId = highlightId;
      nextHighlightId = Math.max(nextHighlightId, highlightId + 1);
    } else {
      this.highlightId = nextHighlightId++;
    }
	}
}

//
// import CharacterRange from './characterRange';
// import Refills from '../refills';
// import rangeUtils from '../range-utils';
// import { compute } from './compute';
// import type { Options } from './compute';
//
// type StandardBehaviorOptions = {|
//   ...Options;
//   behavior?: 'auto' | 'smooth';
// |}
//
// let nextHighlightId = 1;
//
// export default class Highlight {
//   characterRange: CharacterRange;
//   refills: Refills;
//   applied: boolean = false;
//   range: Range;
//   highlightId: number;
//   constructor (characterRange: CharacterRange, highlightId: number | null, refills: Refills) {
//     this.characterRange = characterRange;
//     this.refills = refills;
//     if (highlightId) {
//       this.highlightId = highlightId;
//       nextHighlightId = Math.max(nextHighlightId, highlightId + 1);
//     } else {
//       this.highlightId = nextHighlightId++;
//     }
//   }
//
//   on (): void {
//     this.range = this.characterRange.toRange();
//     this.refills.appliesToRange(this.range);
//     this.applied = true;
//   }
//
//   off (): void {
//     this.range = this.characterRange.toRange();
//     this.refills.wipeToRange(this.range);
//     this.applied = false;
//   }
//
//   intersectsNode (node: Node): boolean {
//     const range = document.createRange();
//     range.selectNodeContents(node);
//
//     return rangeUtils.intersectsRange(this.characterRange.toRange(), range);
//   }
//
//   scrollIntoView (options?: StandardBehaviorOptions | boolean): void {
//     let behavior = typeof options === 'boolean' ? undefined : options?.behavior
//     compute(this.characterRange.toRange(), getOptions(options)).forEach(({ el, top, left }) => {
//       el.scrollTo({ top, left, behavior: behavior });
//     });
//   }
//
//   getText (): string {
//     return this.toRange().toString();
//   }
//
//   toRange (): Range {
//     return this.characterRange.toRange();
//   }
// }
//
// function getOptions (options?: any): Options {
//   if (options === false) {
//     return { block: 'end', inline: 'nearest' }
//   }
//
//   // $FlowIgnore
//   if (options === Object(options) && Object.keys(options).length !== 0) {
//     // $FlowIgnore
//     return options;
//   }
//
//   return { block: 'start', inline: 'nearest' }
// }
