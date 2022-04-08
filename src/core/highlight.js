'use strict';

export default class Highlight {
  /**
   *
   * @param {CharacterRange} characterRange
   * @param {Applier} applier
   */
  constructor(characterRange, applier) {
    this.characterRange = characterRange;
    this._applier = applier;
    this.appliesd = false;
  }

  apply () {
    this.appliesd = true;
    this._applier.applyToRange(this.characterRange.getRange());
  }

  unapply () {
    this.appliesd = false;
    this._applier.undoToRange(this.characterRange.getRange());
  }

}
