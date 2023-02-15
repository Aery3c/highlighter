// @flow
'use strict'

import EventEmitter from './utils/eventEmitter';
import Refills from './refills';
import CharacterRange from './utils/characterRange';
import Highlight from './utils/highlight';
import rangeUtils from './range-utils';
import type { HighlighterOptions, UseSelOptions } from './types';

type EventMap = {|
  click: () => void;
|}

export default class Highlighter extends EventEmitter<EventMap> {

  refills: Refills;
  highlights: Array<Highlight> = [];
  constructor (options?: HighlighterOptions) {
    super();
    this.setOptions(options);
  }

  setOptions (options?: HighlighterOptions) {
    this.refills = new Refills(options);
  }

  useSelection (useSelOptions?: UseSelOptions = {}): Highlight[] {
    let highlights = [];
    const sel = rangeUtils.getSelection(useSelOptions.selection),
      referenceNode = getReferenceNode(useSelOptions.referenceNodeId);

    if (referenceNode) {
      const characterRanges = CharacterRange.fromSelection(sel, referenceNode);
      highlights = this._useCharacterRanges(characterRanges);

      restoreSelection(sel, characterRanges);
    }

    return highlights;
  }
  // $FlowIgnore
  _useCharacterRanges (characterRanges: CharacterRange[]): Highlight[] {
    const undoToHighligts: Highlight[] = [];

    for (let i = 0, characterRange; (characterRange = characterRanges[i++]);) {
      if (characterRange.isCollapsed) {
        // ignore empty characterRange
        continue;
      }

      let isEqual = false;
      for (let j = 0, stockHighlight; (stockHighlight = this.highlights[j]); ++j) {

        if (characterRange.isEqual(stockHighlight.characterRange)) {
          isEqual = true;
          continue;
        }

        if (characterRange.isIntersects(stockHighlight.characterRange) || characterRange.isAdjoin(stockHighlight.characterRange)) {
          // $FlowIgnore
          characterRange = characterRange.union(stockHighlight.characterRange);
          undoToHighligts.push(stockHighlight);
          this.highlights.splice(j--, 1);
        }
      }

      if (!isEqual && characterRange) {
        this.highlights.push(new Highlight(characterRange, this.refills));
      }

      undoToHighligts.forEach(highlight => {
        if (highlight.applied) {
          highlight.off();
        }
      });

      const newHighlight: Highlight[] = [];
      this.highlights.forEach(highlight => {
        if (!highlight.applied) {
          highlight.on();
          newHighlight.push(highlight)
        }
      });

      return newHighlight

    }
  }

  unSelection (useSelOptions?: UseSelOptions = {}): void {
    const sel = rangeUtils.getSelection(useSelOptions.selection),
      referenceNode = getReferenceNode(useSelOptions.referenceNodeId);

    if (referenceNode) {
      const characterRanges = CharacterRange.fromSelection(sel, referenceNode);
      this._unCharacterRanges(characterRanges);

      restoreSelection(sel, characterRanges);
    }
  }

  _unCharacterRanges (characterRanges: CharacterRange[]) {
    console.log(characterRanges);
  }
}

function getReferenceNode (id?: string): HTMLElement | null {
  // $FlowIgnore
  return document.getElementById(id) || document.body;
}

function restoreSelection (selection: Selection, characterRanges: CharacterRange[]): void {
  selection.removeAllRanges();
  characterRanges.forEach(characterRange => {
    if (!characterRange.isCollapsed) {
      selection.addRange(characterRange.toRange());
    }
  });
}