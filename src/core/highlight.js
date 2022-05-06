'use strict';
import { findClosest } from '../utils';

export default class Highlight {
  /**
   *
   * @param {CharacterRange} characterRange
   * @param {Applier} applier
   */
  constructor(characterRange, applier) {
    this.characterRange = characterRange;
    this.value = characterRange.toString();
    this.appliesd = false;
    this._applier = applier;
  }

  apply () {
    this.appliesd = true;
    this._applier.applyToRange(this.characterRange.getRange());
  }

  unapply () {
    this.appliesd = false;
    this._applier.undoToRange(this.characterRange.getRange());
  }

  update () {
    let charRange = this.characterRange, markText = this.value;

    if (charRange.start === charRange.end) {
      return;
    }

    const points = find(document.body.textContent, markText);

    const start = charRange.start;

    if (points.length) {
      const pos = findClosest(start, points);
      if (pos !== start) {
        charRange.setStart(pos);
        charRange.setEnd(pos + markText.length);
      }
    }

    this.restart();
  }

  restart () {
    this.unapply();
    this.apply();
  }

}

/**
 * @param {string} fullText
 * @param {string} str
 * @return {number[]}
 */
function find (fullText, str) {
  let nums = [], pos = fullText.indexOf(str);
  while (pos !== -1) {
    nums.push(pos);
    pos = fullText.indexOf(str, pos + 1);
  }

  return nums
}

function check (fullText, str) {

}