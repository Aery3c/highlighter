'use strict'

import Refills from '@/refills';
import CharacterRange from './characterRange';
import Highlight from './highlight';
import { each } from '@/utils';

class Highlighter {
  constructor(options) {
    this.options = options;
    this.refills = new Refills(options);
    this.highlights = [];
  }

  /**
   *
   * @param options
   */
  highlightASelection (options) {
    options = createOptions(options);

    const selection = getSelection(options.selection),
      referenceNode = getReferenceNode(options.referenceNodeId);

    const characterRanges = CharacterRange.fromSelection(selection, referenceNode);

    const highlights = this._highlightCharacterRanges(characterRanges);

    restoreSelection(selection, characterRanges);

    return highlights;
  }

  /**
   *
   * @param {CharacterRange[]} characterRanges
   * @return {*}
   */
  _highlightCharacterRanges (characterRanges) {

    let i, j, characterRange, undoToHighligts = [];

    for (i = 0; (characterRange = characterRanges[i++]);) {
      if (characterRange.isCollapsed) {
        // ignore empty characterRange
        continue;
      }

      let isEqual = false, stockHighlight;
      for (j = 0; (stockHighlight = this.highlights[j]); ++j) {
        if (characterRange.isEqual(stockHighlight.characterRange)) {
          isEqual = true;
          continue;
        }

        if (characterRange.isIntersects(stockHighlight.characterRange) || characterRange.isAdjoin(stockHighlight.characterRange)) {
          characterRange = characterRange.union(stockHighlight.characterRange);
          undoToHighligts.push(stockHighlight);
          this.highlights.splice(j--, 1);
        }
      }

      if (!isEqual) {
        this.highlights.push(new Highlight(characterRange, this.refills));
      }
    }

    undoToHighligts.forEach(highlight => {
      if (highlight.applied) {
        highlight.off();
      }
    });

    const newHighlight = [];
    this.highlights.forEach(ht => {
      if (!ht.applied) {
        ht.on();
        newHighlight.push(ht)
      }
    });

    return newHighlight
  }

  unhighlightSelection () {

  }


}

function createOptions(options) {
  const defaultOptions = {};

  each(options, (propName, propValue) => {
    defaultOptions[propName] = propValue;
  });

  return defaultOptions;
}

function getReferenceNode (id) {
  const el = document.getElementById(id);
  if (el) {
    return el;
  }

  return document.body;
}

function getSelection (selection) {
  if (selection instanceof Selection) {
    return selection;
  }

  return window.getSelection();
}

/**
 *
 * @param {Selection} selection
 * @param {CharacterRange[]} characterRanges
 */
function restoreSelection (selection, characterRanges) {
  selection.removeAllRanges();
  characterRanges.forEach(characterRange => {
    if (!characterRange.isCollapsed) {
      selection.addRange(characterRange.toRange());
    }
  });
}

export default Highlighter;