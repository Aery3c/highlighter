'use strict'

import { createOptions } from './utils';
import { getContainerElement } from './dom';
import CharacterRange from './core/characterRange';

const highligterPropsNames = ['className', 'tagName'];

export default class Highlighter {
  constructor (options = {}) {
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
    characterRanges.forEach(characterRange => {
      // todo
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
      characterRange: CharacterRange.fromRange(range, containerElement),
      isBackward: selection.isBackward()
    })
  });

  return selInfos;
}
