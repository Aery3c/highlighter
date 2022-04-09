'use strict'

import CharacterRange from './core/characterRange';
import Applier from './core/applier';
import Highlight from './core/highlight';

export default class Highlighter {
  constructor(options = {}) {
    this.highlights = [];
    this._applier = new Applier(options);
  }

  /**
   * @param {Selection | Range | Node | Node[]} [thing]
   * @return {Highlight[]}
   */
  highlight (thing) {

  }

  /**
   *
   * @param {Selection} [selection]
   * @param {Object} [options]
   * @return {Highlight[]}
   */
  highlightSelection (selection, options = {}) {
    const highlights = this.highlights, applier = this._applier;
    selection = selection || window.getSelection();
    const containerElement = options.containerElement || document.body;
    const characterRanges = serializeSelection(selection, containerElement);

    const newHighlights = highlightCharacterRange(characterRanges, highlights, applier);

    restoreSelection(selection, characterRanges);

    return newHighlights;
  }
}

/**
 *
 * @param {Selection} selection
 * @param {HTMLElement} containerElement
 * @return {CharacterRange[]}
 */
function serializeSelection (selection, containerElement) {
  const ranges = selection.getAllRange();
  return ranges.map(range => CharacterRange.rangeToCharacterRange(range, containerElement));
}

function highlightCharacterRange (characterRanges, highlights, applier) {
  const removeToHighligts = [];
  characterRanges.forEach(cr => {
    if (cr.start === cr.end) {
      // igone empty range
      return false;
    }

    // compare each range with the existing highlight range
    for (let i = 0, ht; (ht = highlights[i]); ++i) {
      const htcr = ht.characterRange;

      if (cr.isIntersects(htcr) || cr.isContiguousWith(htcr)) {
        // 如果字符范围和高亮范围产生交集和相连
        cr = cr.union(htcr);
        removeToHighligts.push(ht);
        highlights.splice(i, 1);
        i--;
      }
    }

    highlights.push(new Highlight(cr, applier));
  });

  // off
  removeToHighligts.forEach(removeHt => {
    if (removeHt.appliesd) {
      removeHt.unapply();
    }
  });

  // on
  return highlights.map(ht => {
    if (!ht.appliesd) {
      ht.apply();
    }
    return ht;
  });
}

/**
 *
 * @param {Selection} selection
 * @param {CharacterRange[]} characterRanges
 */
export function restoreSelection (selection, characterRanges) {
  selection.removeAllRanges();
  characterRanges.forEach(characterRange => {
    const range = characterRange.getRange();
    selection.addRange(range);
  });
}