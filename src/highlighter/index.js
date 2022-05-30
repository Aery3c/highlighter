/**
 * highlight selection
 */
'use strict'
import core from '@/core';

export default class Highlighter {
  /**
   *
   * @param {Applier} _applier
   */
  constructor(_applier) {
    /** @type {Highlight[]} */
    this.highlights = [];
    this._applier = _applier;
  }

  /**
   * highlight Selection
   *
   * 高亮当前的选中
   * @param {Selection} [selection]
   * @return {Highlight[]}
   */
  highlightSelection (selection) {
    selection = getSelection(selection);

    const characterRanges = serializeSelection(selection);

    const newHighlights = highlightCharacterRanges(characterRanges, this.highlights, this._applier);

    restoreSelection(selection, characterRanges);

    return newHighlights;
  }

  /**
   * undo highlight in selection
   *
   * 从当前的选中撤销高亮
   * @param {Selection} [selection]
   * @return {Highlight[]}
   */
  unhighlightSelection (selection) {
    selection = getSelection(selection);

    const characterRanges = serializeSelection(selection);

    const newHighlights = unhighlightCharacterRanges(characterRanges, this.highlights, this._applier);

    restoreSelection(selection, characterRanges);

    return newHighlights;
  }

  /**
   * 根据node节点获取highlight对象
   * @param {Node} node
   * @return {Highlight | null}
   */
  getHighlightForNode (node) {
    for (let highlight of this.highlights) {
      if (highlight.containsNode(node)) {
        return highlight;
      }
    }

    return null
  }

  /**
   * remove highlight
   *
   * 删除高亮
   * @param {Highlight[]} highlights
   */
  removeHighlights (highlights) {
    if (Array.isArray(highlights) && highlights.length) {
      let i = 0, highlight, len = this.highlights.length;
      for (; i < len; ++i) {
        highlight = this.highlights[i];
        if (highlights.indexOf(highlight) > -1) {
          highlight.unapply();
          this.highlights.splice(i--, 1);
        }
      }
    }
  }

  removeAllHighlight () {
    for (let i = 0, highlight; (highlight = this.highlights[i]); ++i) {
      highlight.unapply();
      this.highlights.splice(i--, 1);
    }
  }
}

/**
 *
 * @param {CharacterRange[]} characterRanges
 * @param {Highlight[]} highlights
 * @param {Applier} applier
 * @return {Highlight[]}
 */
function unhighlightCharacterRanges (characterRanges, highlights, applier) {
  const removeToHighlights = [];
  characterRanges.forEach(cr => {
    if (cr.start === cr.end) {
      // ignore empty range
      return false;
    }

    let highlight, i;
    for (i = 0; (highlight = highlights[i]); ++i) {
      const htcr = highlight.characterRange;
      if (cr.isIntersects(htcr)) {
        // isIntersects
        const intersect = cr.intersection(htcr);
        const complements = htcr.complementarySet(intersect);
        complements.forEach(complement => {
          // add complement
          highlights.push(core.createHighlight(complement, applier));
        });
        removeToHighlights.push(highlight);
        highlights.splice(i--, 1);
      }
    }
  });

  // off
  removeToHighlights.forEach(removeHt => {
    if (removeHt.applied) {
      removeHt.unapply();
    }
  });

  // on
  return highlights.map(ht => {
    if (!ht.applied) {
      ht.apply();
    }
    return ht;
  });
}

/**
 * highlight characterRanges
 * @param {CharacterRange[]} characterRanges
 * @param {Highlight[]} highlights
 * @param {Applier} applier
 * @return {Highlight[]}
 */
function highlightCharacterRanges (characterRanges, highlights, applier) {
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

      if (cr.isOverlap(htcr)) {
        // ignore same range
        isRangeSame = true;
        continue;
      }

      if (cr.isIntersects(htcr) || cr.isAdjoin(htcr)) {
        // range intersect joint
        cr = cr.union(htcr);
        removeToHighligts.push(ht);
        highlights.splice(i--, 1);
      }
    }

    if (!isRangeSame) {
      highlights.push(core.createHighlight(cr, applier));
    }
  });

  // off
  removeToHighligts.forEach(removeHt => {
    if (removeHt.applied) {
      removeHt.unapply();
    }
  });

  // on
  return highlights.map(ht => {
    if (!ht.applied) {
      ht.apply();
    }
    return ht;
  });
}

/**
 *
 * @param {Selection} selection
 * @return {CharacterRange[]}
 */
function serializeSelection (selection) {
  const ranges = selection.getAllRange();
  return ranges.map(range => range.getBookmark());
}

function getSelection (selection) {
  return (selection instanceof Selection && selection)
    || window.getSelection();
}

/**
 *
 * @param {Selection} selection
 * @param {CharacterRange[]} characterRanges
 */
function restoreSelection (selection, characterRanges) {
  selection.removeAllRanges();
  characterRanges.forEach(characterRange => {
    const range = characterRange.toRange();
    selection.addRange(range);
  });
}
