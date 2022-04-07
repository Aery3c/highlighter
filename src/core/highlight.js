'use strict';

export default class Highlight {
  constructor(className, tagName, characterRange, containerElement, containerElementId) {
    this.className = className;
    this.tagName = tagName;
    this.characterRange = characterRange;
    this.containerElement = containerElement;
    this.containerElementId = containerElementId;
    this.applied = false;
  }

  apply () {
    this.applied = true;
    this.applyRange(this.characterRange.getRange());
  }
}
