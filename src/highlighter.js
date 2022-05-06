'use strict'

import CharacterRange from './core/characterRange';
import Applier from './core/applier';
import Highlight from './core/highlight';
import { findClosest } from './utils';

export default class Highlighter {
  constructor(options = {}) {
    this.highlights = [];
    this._applier = new Applier(options);
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
    // todo
    const remove = [], highlights = this.highlights;
    for (let i = 0, ht; (ht = highlights[i]); ++i) {
      const markText = ht.value;
      const points = search(document.body.textContent, markText);
      if (points.length) {
        const offset = ht.characterRange.start;

        const start = findClosest(offset, points);

        if (start !== offset) {
          remove.push(ht);
          highlights.push(new Highlight(new CharacterRange(start, start + markText.length), this._applier));
          highlights.splice(i--, 1);
        }
      } else {
        highlights.splice(i--, 1);
      }

    }

    remove.forEach(rh => {
      if (rh.appliesd) {
        rh.unapply();
      }
    });

    highlights.forEach(ht => {
      if (!ht.appliesd) {
        ht.apply();
      }
    });
    
  }

  inspect () {

  }
}

/**
 * @param {string} fullText
 * @param {string} str
 * @return {number[]}
 */
function search (fullText, str) {
  let nums = [], pos = fullText.indexOf(str);
  while (pos !== -1) {
    nums.push(pos);
    pos = fullText.indexOf(str, pos + 1);
  }

  return nums
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
