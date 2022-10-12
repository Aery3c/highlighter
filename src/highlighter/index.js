'use strict'

import Refills from '@/refills';
import CharacterRange from './characterRange';
import Highlight from './highlight';
import EventEmitter from './eventEmitter';
import TextSearch from './textSearch';
import { each } from '@/utils';

class Highlighter extends EventEmitter {
  constructor(options) {
    super();
    this.setOptions(options);
    this.highlights = [];
    this.textSearch = new TextSearch();
  }

  /**
   *
   * @param [options]
   * @return {Highlight[]}
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

  unHighlightASelection (options) {
    options = createOptions(options);

    const selection = getSelection(options.selection),
      referenceNode = getReferenceNode(options.referenceNodeId);

    const characterRanges = CharacterRange.fromSelection(selection, referenceNode);

    this._unHighlightCharacterRanges(characterRanges);

    restoreSelection(selection, characterRanges);
  }

  isHighlightedASelection () {
  }

  /**
   *
   * @param {string} text
   * @param {string} [referenceNodeId]
   */
  highlightAText (text, referenceNodeId) {
    const referenceNode = getReferenceNode(referenceNodeId),
      textSearch = this.textSearch;

    textSearch.setup([text]);
    console.log(textSearch.findOne(text, referenceNode.textContent, true));
  }

  unHighlightAText () {

  }

  /**
   *
   * @param {CharacterRange[]} characterRanges
   * @return {Highlight[]}
   */
  _highlightCharacterRanges (characterRanges) {

    const undoToHighligts = [];

    for (let i = 0, characterRange; (characterRange = characterRanges[i++]);) {
      if (characterRange.isCollapsed) {
        // ignore empty characterRange
        continue;
      }

      let isEqual = false;
      for (let j = 0, stockHighlight; (stockHighlight = this.highlights[j]); ++j) {
        // if (characterRange.referenceNode !== stockHighlight.characterRange.referenceNode) {
        //   continue;
        // }

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

  _unHighlightCharacterRanges (characterRanges) {

    const undoToHighlights = [];

    for (let i = 0, characterRange; (characterRange = characterRanges[i++]); ) {
      if (characterRange.isCollapsed) {
        continue;
      }

      for (let j = 0, stockHighlight; (stockHighlight = this.highlights[j]); ++j) {
        if (characterRange.isIntersects(stockHighlight.characterRange)) {
          const intersectionCr = characterRange.intersection(stockHighlight.characterRange);
          const complementCrs = stockHighlight.characterRange.complementarySet(intersectionCr);
          complementCrs.forEach(complementCr => {
            // add complement
            this.highlights.push(new Highlight(complementCr, this.refills));
          });
          undoToHighlights.push(stockHighlight);
          this.highlights.splice(j--, 1);
        }
      }
    }

    undoToHighlights.forEach(highlight => {
      if (highlight.applied) {
        highlight.off();
      }
    });

    this.highlights.forEach(ht => {
      if (!ht.applied) {
        ht.on();
      }
    });
  }

  /**
   *
   * @param {HTMLElement} el
   * @return {Highlight | null}
   */
  getHighlightForElement (el) {
    for (let i = 0, highlight; (highlight = this.highlights[i++]);) {
      if (highlight.intersectsNode(el)) {
        return highlight;
      }
    }

    return null;
  }

  /**
   *
   * @param {Highlight} highlight
   */
  removeHighlight (highlight) {
    if (highlight instanceof Highlight) {
      let highlights = this.highlights, index;
      if ((index = highlights.indexOf(highlight)) > -1) {
        if (highlight.applied) {
          highlight.off();
        }

        highlights.splice(index, 1);
      }
    }
  }

  removeAllHighlight () {
    for (let i = 0, highlight; (highlight = this.highlights[i]); ++i) {
      if (highlight.applied) {
        highlight.off();
      }
      this.highlights.splice(i--, 1);
    }
  }

  _handleHighlightClick (event, el) {
    this.emit('click', this.getHighlightForElement(el), el, event);
  }

  setOptions (options) {
    const newOptions = {};

    const self = this;
    function handleHighlightClick (event) {
      self._handleHighlightClick(event, this);
    }

    each(options, (propName, propValue) => {
      newOptions[propName] = propValue;
    });

    newOptions['elProps'] = {
      ...newOptions['elProps'],
      onclick: handleHighlightClick
    }

    this.refills = new Refills(newOptions);

    return newOptions;
  }

  save () {
    // todo
    // https://github.com/LukasRada/rangee
    // https://github.com/tildeio/range-serializer
  }

  restore () {

  }
}

function createOptions(options) {
  const newOptions = {};

  each(options, (propName, propValue) => {
    newOptions[propName] = propValue;
  });

  return newOptions;
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