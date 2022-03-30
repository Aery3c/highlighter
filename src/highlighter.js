'use strict'

import { createOptions } from './utils';
import { getContainerElement } from './dom';
import CharacterRange from './core/characterRange';
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

    return this.highlightToCharacterRanges(characterRanges, containerElementId);
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
        new Highlight({
          className: this.className,
          tagName: this.tagName,
          characterRange,
          containerElement,
          containerElementId,
        })
      )
    });

    this.highlights.forEach(highlight => {
      highlight.apply();
    });

  }
}

/**
 *
 * @param {Selection} selection
 * @param {HTMLElement} containerElement
 * @return {{ characterRange: CharacterRange, isBackward: boolean }[]}
 */
export function serializeSelection (selection, containerElement) {
  const selInfos = [];
  const ranges = selection.getAllRange();
  ranges.forEach(range => {
    selInfos.push({
      characterRange: CharacterRange.rangeToCharacterRange(range, containerElement),
      isBackward: selection.isBackward()
    })
  });

  return selInfos;
}
