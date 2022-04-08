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

    resizeWidthHighlights(characterRanges, highlights, applier);

    const newHighlights = [];
    highlights.forEach(ht => {
      newHighlights.push(ht);
      ht.apply();
    });

    return newHighlights;
  }

  highlightSelection () {

  }
}

function serializeSelection (selection) {
  const ranges = selection.getAllRange();
  return ranges.map(range => CharacterRange.rangeToCharacterRange(range, range.startContainer.ownerDocument.body));
}

/**
 *
 * @param {CharacterRange[]} characterRanges
 * @param {Highlight[]} highlights
 * @param {Applier} applier
 */
function resizeWidthHighlights (characterRanges, highlights, applier) {

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

  // console.log(removeToHighligts, 'removeToHighligts');
  // removeToHighligts.forEach(removeHt => {
  //   removeHt.unapply();
  // });

}
