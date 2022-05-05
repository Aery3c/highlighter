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
    selection = getSelection(selection);

    const characterRanges = serializeSelection(selection);

    const newHighlights = highlightCharacterRange(characterRanges, this.highlights, this._applier);

    restoreSelection(selection, characterRanges);

    return newHighlights;
  }

  /**
   *
   * @param {Selection} [selection]
   */
  unhighlightSelection (selection) {
    selection = getSelection(selection);

    const characterRanges = serializeSelection(selection);

    const newHighlights = unhighlightCharacterRange(characterRanges, this.highlights, this._applier);

    restoreSelection(selection, characterRanges);

    return newHighlights;
  }

  update () {
    this.highlights.forEach(ht => {
      const cr = ht.characterRange;
      const bigRange = cr.getRange().cloneRange();
      bigRange.setStart(document.body, 0);

      const text = bigRange.toString().slice(cr.start, cr.end);
      if (text !== ht.value) {
        console.log('dom change');
      }
    });
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
function unhighlightCharacterRange (characterRanges, highlights, applier) {
  characterRanges.forEach(cr => {
    if (cr.start === cr.end) {
      // ignore empty range
      return false;
    }

    let highlight, i, removeToHighlights = [];
    for (i = 0; (highlight = highlights[i]); ++i) {
      const htcr = highlight.characterRange;
      if (cr.isIntersects(htcr)) {
        // isIntersects
        const intersect = cr.intersection(htcr);
        const complements = htcr.complementarySet(intersect);
        complements.forEach(complement => {
          // add complement
          highlights.push(new Highlight(complement, applier));
        });
        removeToHighlights.push(highlight);
        highlights.splice(i--, 1);
      }
    }

    // off
    removeToHighlights.forEach(removeHt => {
      if (removeHt.appliesd) {
        removeHt.unapply();
      }
    });

    // on
    return highlights.map(ht => {
      if (!ht.appliesd) {
        ht.apply();
      }
    })
  });
}

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

function getSelection (selection) {
  return (selection instanceof Selection && selection)
  || window.getSelection();
}
