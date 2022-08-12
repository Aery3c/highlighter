'use strict'

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

}

export default Highlight;