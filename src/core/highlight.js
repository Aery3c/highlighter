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

      if (charRange.toString() !== markText) {
        console.log('remove self!!!');
      }

      // this.restart();
    }
  }

  restart () {
    this.unapply();
    this.apply();
  }

  inspect () {
    const charRange = this.characterRange, appliesd = this.appliesd, markText = this.value;
    const range = charRange.getRange(), characterText = charRange.toString();
    console.log('{');
    console.log('  commonAncestor:', range.commonAncestorContainer);
    console.log(`  markText: %c${markText}`, consoleStyle);
    console.log(`  characterText: ${characterText}`);
    console.log(`  characterRange: { start: ${charRange.start}, end: ${charRange.end} }`);
    console.log(`  appliesd:`, appliesd);
    console.log('}');
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

const consoleStyle = [
  'background: rgb(254, 232, 195)',
  'color: rgb(51, 51, 51)',
  'border: 1px solid #ccc',
  'border-radius: 4px',
  'padding: 4px 0'
].join(';');
