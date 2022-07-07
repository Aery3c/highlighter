'use strict'

import core from '@/core';
import Highlight from '@/highlight';
import ee from './event-emitter';

class Highlighter {
  /**
   *
   * @param {string} name
   * @param {Object} options
   */
  constructor(name, options) {
    this.highlights = [];
    this.name = name;
    this.options = core.utils.getDefaultOptions();
    this.setOptions(options);

    this.setOptions({
      elProps: {
        ...this.options.elProps,
        onclick: this._handleHighlightClick,
      }
    })
  }

  setOptions (options) {
    this.options = {
      ...this.options,
      ...options
    };

    this.applier = core.createApplier({
      className: this.name,
      tagName: this.options.tagName,
      elAttrs: this.options.elAttrs,
      elProps: this.options.elProps
    });
  }

  /**
   *
   * @param {Selection} [selection]
   * @return {Highlight[]}
   */
  highlightSelection (selection) {
    selection = getSelection(selection);
    const containerElement = this.options.containerElement;

    const characterRanges = selection.toCharacterRanges(containerElement), highlights = this.highlights;

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
        highlights.push(core.createHighlight(cr, this.applier, containerElement));
      }
    });

    // off
    removeToHighligts.forEach(removeHt => {
      if (removeHt.applied) {
        removeHt.off();
      }
    });

    // on
    const newHighlight = [];
    highlights.forEach(ht => {
      if (!ht.applied) {
        ht.on();
        newHighlight.push(ht)
      }
    });
    this.emit(core.event.CREATE, newHighlight, this);
    restoreSelection(selection, characterRanges, containerElement);

    return newHighlight;
  }

  unhighlightSelection (selection) {
    selection = getSelection(selection);

    const containerElement = this.options.containerElement;
    const characterRanges = selection.toCharacterRanges(containerElement), highlights = this.highlights;

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
            highlights.push(core.createHighlight(complement, this.applier, containerElement));
          });
          removeToHighlights.push(highlight);
          highlights.splice(i--, 1);
        }
      }
    });

    // off
    const unHighlights = [];
    removeToHighlights.forEach(removeHt => {
      if (removeHt.applied) {
        removeHt.off();
        unHighlights.push(removeHt);
      }
    });

    // on
    highlights.forEach(ht => {
      if (!ht.applied) {
        ht.on();
      }
      return ht;
    });

    restoreSelection(selection, characterRanges, containerElement);

    return unHighlights;
  }

  /**
   *
   * @param {HTMLElement} el
   * @return {Highlight | null}
   */
  getHighlightInElement (el) {
    for (let highlight of this.highlights) {
      if (highlight.containsElement(el)) {
        return highlight;
      }
    }

    return null
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

  _handleHighlightClick = (e) => {
    const highlight = this.getHighlightInElement(e.target);
    if (highlight) {
      this.emit(core.event.CLICK, highlight, this, e);
    }
  }

  serialize () {

  }

  deserialize () {

  }
}

function parse () {
  let i = 0, selection, options = arguments[i] || {};

  if (options instanceof Selection) {
    selection = options;
    i++;
    options = arguments[i] || {};
  }

  if (core.utils.toType(options) !== 'object') {
    options = {};
  }
  selection = getSelection(selection);

  return { selection, options };
}

function getSelection (selection) {
  return (selection instanceof Selection && selection)
    || window.getSelection();
}

/**
 *
 * @param {Selection} selection
 * @param {CharacterRange[]} characterRanges
 * @param {HTMLElement} containerElement
 */
function restoreSelection (selection, characterRanges, containerElement) {
  selection.removeAllRanges();
  characterRanges.forEach(characterRange => {
    const range = characterRange.toRange(containerElement);
    selection.addRange(range);
  });
}

ee(Highlighter.prototype);

export default Highlighter;
