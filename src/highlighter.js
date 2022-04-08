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
  paint (thing) {
    const highlights = this.highlights, applier = this._applier;
    // defalut use selection
    let characterRanges = serializeSelection(window.getSelection());

    resizeWithHighlights(characterRanges, highlights, applier);

    const newHighlights = [];
    highlights.forEach(ht => {
      newHighlights.push(ht);
      ht.apply();
    });

    return newHighlights;
  }

  /**
   *
   * @param {Selection} selection
   * @param {Object} options
   * @return {Highlight[]}
   */
  highlightSelection (selection, options = {}) {
    const highlights = this.highlights, applier = this._applier;
    selection = selection || window.getSelection();
    const containerElement = options.containerElement || document.body;
    const characterRanges = serializeSelection(selection, containerElement);

    resizeWithHighlights(characterRanges, highlights, applier);

    const newHighlights = [];
    highlights.forEach(ht => {
      newHighlights.push(ht);
      if (!ht.appliesd) {
        ht.apply();
      }
    });

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

/**
 *
 * @param {CharacterRange[]} characterRanges
 * @param {Highlight[]} highlights
 * @param {Applier} applier
 */
function resizeWithHighlights (characterRanges, highlights, applier) {

  const removeToHighligts = [];
  characterRanges.forEach(cr => {
    if (cr.start === cr.end) {
      // igone empty range
      return false;
    }

    // compare each range with the existing highlight range
    for (let i = 0, ht; (ht = highlights[i]); ++i) {
      const htcr = ht.characterRange;

      if (cr.intersects(htcr) || cr.isContiguousWith(htcr)) {
        // 如果字符范围和高亮范围产生交集和相连
        cr = cr.union(htcr);
        removeToHighligts.push(ht);
        highlights.splice(i, 1);
        i--;
      }
    }

    highlights.push(new Highlight(cr, applier));
  });

  console.log(removeToHighligts, 'removeToHighligts');
  removeToHighligts.forEach(removeHt => {
    if (removeHt.appliesd) {
      removeHt.unapply();
    }
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