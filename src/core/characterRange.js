/**
 *
 * @param {Range} range
 * @param {HTMLElement} containerElement
 * @return {CharacterRange}
 */
// eslint-disable-next-line no-unused-vars
function rangeToCharacterRange(range, containerElement) {
  // todo
  // const bookMark = range.getBookMark(containerElement);
}

export default class CharacterRange {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
}
