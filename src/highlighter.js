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
  highlight () {

  }

  /**
   *
   * @param {Selection} [selection]
   * @return {Highlight[]}
   */
  highlightSelection (selection) {
    const highlights = this.highlights, applier = this._applier;
    selection = selection || window.getSelection();

    const characterRanges = serializeSelection(selection);

    const newHighlights = highlightCharacterRange(characterRanges, highlights, applier);

    restoreSelection(selection, characterRanges);

    return newHighlights;
  }

  /**
   *
   * @param {Selection} selection
   */
  unhighlightSelection () {
    // const highlights = this.highlights, applier = this._applier;
    // selection = selection || window.getSelection();
    //
    // const characterRanges = serializeSelection(selection);

    // unhighlightCharacterRange(characterRanges, highlights, applier);
  }
}

/**
 *
 * @param {Selection} selection
 * @return {CharacterRange[]}
 */
function serializeSelection (selection) {
  const ranges = selection.getAllRange();
  return ranges.map(range => CharacterRange.rangeToCharacterRange(range));
}

/**
 *
 * @param {CharacterRange[]} characterRanges
 * @param {Highlight[]} highlights
 * @param {Applier} applier
 * @return {Highlight[]}
 */
function highlightCharacterRange (characterRanges, highlights, applier) {
  const removeToHighligts = [];
  characterRanges.forEach(cr => {
    if (cr.start === cr.end) {
      // ignore empty range
      return false;
    }

    let isRangeSame = false;
    // compare each range with the existing highlight range
    for (let i = 0, ht; (ht = highlights[i]); ++i) {
      const htcr = ht.characterRange;

      if (cr.isEqual(htcr)) {
        // ignore same range
        isRangeSame = true;
        continue;
      }

      if (cr.isIntersects(htcr) || cr.isJoint(htcr)) {
        // range intersect joint
        cr = cr.union(htcr);
        removeToHighligts.push(ht);
        highlights.splice(i--, 1);
      }
    }

    if (!isRangeSame) {
      highlights.push(new Highlight(cr, applier));
    }
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
 * @param {CharacterRange[]} characterRanges
 * @param highlights
 * @param applier
 */
// function unhighlightCharacterRange (characterRanges, highlights, applier) {
//
// }

/**
 *
 * @param {Selection} selection
 * @param {CharacterRange[]} characterRanges
 */
function restoreSelection (selection, characterRanges) {
  selection.removeAllRanges();
  characterRanges.forEach(characterRange => {
    const range = characterRange.getRange();
    selection.addRange(range);
  });
}
