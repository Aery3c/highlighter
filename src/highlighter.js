// @flow
'use strict'
import EventEmitter from './utils/eventEmitter';
import Refills from './refills';
import Highlight from './utils/highlight';
import rangeUtils from './range-utils';
import CharacterRange from './utils/characterRange';
import { selectionToCharacterRange } from './utils/selectionToCharacterRange';
import type { HighlighterOptions, DefaultHighlighterOptions } from './types';

type EventMap = {|
  click: (highlight: Highlight, el: HTMLElement, event: MouseEvent) => void;
|}

const defaultOptions = {
  tagName: 'span',
  className: 'highlight',
  elAttrs: {},
  elProps: {},
  normalize: true
}

export default class Highlighter extends EventEmitter<EventMap> {
  refills: Refills;
  highlights: Highlight[] = [];
  options: DefaultHighlighterOptions = defaultOptions;
  constructor (options: HighlighterOptions = {}) {
    super();
    this.setOptions(options);
  }

  setOptions (options: HighlighterOptions = {}) {
    this.options = {
      ...this.options,
      ...options,
      elProps: {
        ...options.elProps,
        // $FlowIgnore
        // onclick: this._handleHighlightClick.bind(this)
      }
    }
    this.refills = new Refills(this.options);
  }
  useSelection (selection?: Selection, referenceNodeId: string = ''): Highlight[] {
    const sel = rangeUtils.getSelection(selection);
    const referenceNode = getReferenceNode(referenceNodeId);
    if (referenceNode) {
      // document.body or other node
      const characterRanges = selectionToCharacterRange(sel, referenceNode);
      // todo
      // this.useCharacterRanges(characterRanges, referenceNodeId)
    }

    return [];
  }

  useHighlights (highlights: Highlight[]): Highlight[] {
    return [];
  }

  // useCharacterRanges (characterRanges: CharacterRange[], referenceNodeId: string = '') {
  //   const undoToHighligts: Highlight[] = [];
  //   for (let i = 0, characterRange; (characterRange = characterRanges[i++]);) {
  //     if (characterRange.start === characterRange.end) {
  //       // ignore empty characterRange
  //       continue;
  //     }
  //   }
  // }
  // eslint-disable-next-line no-unused-vars
  useRange (range: Range, referenceNodeId: string = ''): Highlight[] {
    return [];
  }

}

//
// import EventEmitter from './utils/eventEmitter';
// import Refills from './refills';
// import CharacterRange from './utils/characterRange';
// import Highlight from './utils/highlight';
// import rangeUtils from './range-utils';
// import type { RefillsOptions, UseSelOptions, DefaultRefillsOptions, Serialize } from './types';
//
// type EventMap = {|
//   click: (highlight: Highlight, el: HTMLElement, event: MouseEvent) => void;
// |}
//
// const defaultOptions = {
//   tagName: 'span',
//   className: 'highlight',
//   elAttrs: {},
//   elProps: {},
//   normalize: true
// }
//
// export default class Highlighter extends EventEmitter<EventMap> {
//
//   refills: Refills;
//   highlights: Array<Highlight> = [];
//   options: DefaultRefillsOptions = defaultOptions;
//   constructor (options: RefillsOptions = {}) {
//     super();
//     this.setOptions(options);
//   }
//
//   setOptions (options: RefillsOptions = {}): DefaultRefillsOptions {
//     this.options = {
//       ...this.options,
//       ...options,
//       elProps: {
//         ...options.elProps,
//         // $FlowIgnore
//         onclick: this._handleHighlightClick.bind(this)
//       }
//     }
//
//     this.refills = new Refills(this.options);
//   }
//
//   _handleHighlightClick (event: MouseEvent) {
//     const el = event.target, highlight = this.getHighlightForElement(el);
//     this.emit('click', highlight, el, event);
//   }
//
//   getHighlightForElement (el: any): Highlight | null {
//     for (let i = 0, highlight; (highlight = this.highlights[i++]);) {
//       if (highlight.intersectsNode(el)) {
//         return highlight;
//       }
//     }
//
//     return null;
//   }
//
//   useSelection (useSelOptions: UseSelOptions = {}): Highlight[] {
//     let highlights = [];
//     const sel = rangeUtils.getSelection(useSelOptions.selection),
//       referenceNode = getReferenceNode(useSelOptions.referenceNodeId);
//
//     if (referenceNode) {
//       const characterRanges = CharacterRange.fromSelection(sel, referenceNode);
//       highlights = this._useCharacterRanges(characterRanges);
//
//       restoreSelection(sel, characterRanges);
//     }
//
//     return highlights;
//   }
//   // $FlowIgnore
//   _useCharacterRanges (characterRanges: CharacterRange[]): Highlight[] {
//     const undoToHighligts: Highlight[] = [];
//
//     for (let i = 0, characterRange; (characterRange = characterRanges[i++]);) {
//       if (characterRange.isCollapsed) {
//         // ignore empty characterRange
//         continue;
//       }
//
//       let isEqual = false;
//       for (let j = 0, stockHighlight; (stockHighlight = this.highlights[j]) && this.options.normalize; ++j) {
//
//         if (characterRange.isEqual(stockHighlight.characterRange)) {
//           isEqual = true;
//           continue;
//         }
//
//         if (characterRange.isIntersects(stockHighlight.characterRange) || characterRange.isAdjoin(stockHighlight.characterRange)) {
//           // $FlowIgnore
//           characterRange = characterRange.union(stockHighlight.characterRange);
//           undoToHighligts.push(stockHighlight);
//           this.highlights.splice(j--, 1);
//         }
//       }
//
//       if (!isEqual && characterRange) {
//         this.highlights.push(new Highlight(characterRange, null, this.refills));
//       }
//
//       undoToHighligts.forEach(highlight => {
//         if (highlight.applied) {
//           highlight.off();
//         }
//       });
//
//       const newHighlight: Highlight[] = [];
//       this.highlights.forEach(highlight => {
//         if (!highlight.applied) {
//           highlight.on();
//           newHighlight.push(highlight)
//         }
//       });
//
//       return newHighlight
//
//     }
//   }
//
//   unSelection (useSelOptions: UseSelOptions = {}): Highlight[] {
//     let highlights = [];
//     const sel = rangeUtils.getSelection(useSelOptions.selection),
//       referenceNode = getReferenceNode(useSelOptions.referenceNodeId);
//
//     if (referenceNode) {
//       const characterRanges = CharacterRange.fromSelection(sel, referenceNode);
//       highlights = this._unCharacterRanges(characterRanges);
//
//       restoreSelection(sel, characterRanges);
//     }
//
//     return highlights;
//   }
//
//   _unCharacterRanges (characterRanges: CharacterRange[]): Highlight[] {
//     const undoToHighlights = [];
//
//     for (let i = 0, characterRange; (characterRange = characterRanges[i++]); ) {
//       if (characterRange.isCollapsed) {
//         continue;
//       }
//
//       for (let j = 0, stockHighlight; (stockHighlight = this.highlights[j]); ++j) {
//         if (characterRange.isIntersects(stockHighlight.characterRange)) {
//           const intersectionCr = characterRange.intersection(stockHighlight.characterRange);
//           if (intersectionCr) {
//             const complementCrs = stockHighlight.characterRange.complementarySet(intersectionCr);
//             complementCrs.forEach(complementCr => {
//               // add complement
//               this.highlights.push(new Highlight(complementCr, null, this.refills));
//             });
//             undoToHighlights.push(stockHighlight);
//             this.highlights.splice(j--, 1);
//           }
//         }
//       }
//     }
//
//     const unHighlights: Highlight[] = [];
//     undoToHighlights.forEach(highlight => {
//       if (highlight.applied) {
//         highlight.off();
//         unHighlights.push(highlight);
//       }
//     });
//
//     this.highlights.forEach(highlight => {
//       if (!highlight.applied) {
//         highlight.on();
//       }
//     });
//
//     return unHighlights;
//   }
//
//   removeHighlight (highlight: Highlight): void {
//     if (highlight instanceof Highlight) {
//       let highlights = this.highlights, index;
//       if ((index = highlights.indexOf(highlight)) > -1) {
//         if (highlight.applied) {
//           highlight.off();
//         }
//
//         highlights.splice(index, 1);
//       }
//     }
//   }
//
//   serialize (): Serialize[] {
//     return this.highlights.map(
//       highlight => ({
//         start: highlight.characterRange.start,
//         end: highlight.characterRange.end,
//         highlightId: highlight.highlightId,
//         // $FlowIgnore
//         referenceNodeId: highlight.characterRange.referenceNode.id,
//         className: this.options.className,
//         text: highlight.getText()
//       })
//     );
//   }
//
//   deserialize (serialized: Serialize[]): void {
//     const highlights = [];
//     serialized.forEach(({ start, end, highlightId, referenceNodeId, className }) => {
//       if (className !== this.options.className) {
//         this.setOptions({ className });
//       }
//       const referenceNode = getReferenceNode(referenceNodeId);
//       if (referenceNode) {
//         const highlight = new Highlight(new CharacterRange(start, end, referenceNode), highlightId, this.refills);
//         highlight.on();
//         highlights.push(highlight);
//       }
//     });
//
//     this.highlights = highlights;
//   }
//
// }
//
function getReferenceNode (id: string): HTMLElement | null {
  return document.getElementById(id) || document.body;
}
//
// function restoreSelection (selection: Selection, characterRanges: CharacterRange[]): void {
//   selection.removeAllRanges();
//   characterRanges.forEach(characterRange => {
//     if (!characterRange.isCollapsed) {
//       selection.addRange(characterRange.toRange());
//     }
//   });
// }
