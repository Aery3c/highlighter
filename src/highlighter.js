'use strict'

import { createOptions, restoreSelection, serializeSelection } from './utils';
import { getContainerElement } from './dom';
import Highlight from './core/highlight';

const highligterPropsNames = ['className', 'tagName'];

export default class Highlighter {
  constructor (options = {}) {

    this.highlights = [];

    options = createOptions(options, {
      className: 'highlight',
      tagName: 'span'
    });
    highligterPropsNames.forEach(propName => {
      if (Object.prototype.hasOwnProperty.call(options, propName)) {
        this[propName] = options[propName];
      }
    });
  }

  /**
   *
   * @param {{}} [options]
   */
  highlightToSelection (options = {}) {
    options = createOptions(options, {
      containerElementId: null,
    });

    const containerElementId = options.containerElementId;
    const containerElement = getContainerElement(containerElementId);
    const selection = options.selection || window.getSelection();
    const serialized = serializeSelection(selection, containerElement);

    const characterRanges = [];
    serialized.forEach(({ characterRange } )=> {
      characterRanges.push(characterRange);
    })

    const highlights = this.highlightToCharacterRanges(characterRanges, containerElementId);

    restoreSelection(selection, serialized);

    return highlights;
  }

  /**
   *
   * @param {CharacterRange[]} characterRanges
   * @param {string} containerElementId
   * @return {Highlight[]}
   */
  highlightToCharacterRanges (characterRanges, containerElementId) {

    const containerElement = getContainerElement(containerElementId);

    characterRanges.forEach(characterRange => {
      this.highlights.push(
        new Highlight(
          this.className,
          this.tagName,
          characterRange,
          containerElement,
          containerElementId
        )
      )
    });

    this.highlights.forEach(highlight => {
      if (!highlight.applied) {
        highlight.apply();
      }
    });

  }
}
