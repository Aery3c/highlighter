'use strict'

import core from '@/core';

class Highlight {
  constructor(characterRange, refills) {
    this.characterRange = characterRange;
    this.refills = refills;
    this.applied = false;
  }

  on() {
    this.range = this.characterRange.toRange();
    this.refills.appliesToRange(this.range);
    this.applied = true;
  }

  off () {
    this.range = this.characterRange.toRange();
    this.refills.wipeToRange(this.range);
    this.applied = false;
  }

  intersectsNode(node) {
    const range = document.createRange();
    range.selectNodeContents(node);

    return core.intersectsRange(this.characterRange.toRange(), range);
  }

  _inspect () {
    inspect(this);
  }

}

function inspect (highlight) {
  const characterRange = highlight.characterRange;
  const range = characterRange.toRange(), characterText = range.toString();

  console.log('{');
  console.log('  commonAncestor:', range.commonAncestorContainer);
  console.log(`  characterText: %c${characterText}`, consoleStyle);
  console.log(`  characterRange: { start: ${characterRange.start}, end: ${characterRange.end} }`);
  console.log(`  applied:`, highlight.applied);
  console.log('}');
}

const consoleStyle = [
  'background: rgb(254, 232, 195)',
  'color: rgb(51, 51, 51)',
  'border: 1px solid #ccc',
  'border-radius: 4px',
  'padding: 2px'
].join(';');

export default Highlight;