'use strict'

/** @typedef {{ start: number, end: number, containerElement: HTMLElement }} BookMark */

/**
 *
 * @param {Range} rangeA
 * @param {Range} rangeB
 * @return {boolean}
 */
function rangeIntersect (rangeA, rangeB) {
  const start = rangeA.compareBoundaryPoints(rangeB.END_TO_START, rangeB);
  const end = rangeA.compareBoundaryPoints(rangeB.START_TO_END, rangeB);

  return start < 0 && end > 0;

}

export default  {
  /**
   *
   * @param {HTMLElement} containerElement
   * @return {BookMark}
   */
  getBookMark (containerElement) {
    /** @this Range */
    const surroundRange = this.cloneRange();
    let start = 0, end = 0;
    surroundRange.selectNodeContents(containerElement);
    const range = this.intersectionRange(surroundRange);
    if (range) {
      surroundRange.setEnd(range.startContainer, range.startOffset);
      start = surroundRange.toString().length;
      end = start + range.toString().length
    }

    return {
      start,
      end,
      containerElement
    }
  },
  /**
   *
   * @param {Range} otherRange
   * @return {boolean}
   */
  isIntersect (otherRange) {
    return rangeIntersect(this, otherRange)
  },

  /**
   *
   * @param {Range} otherRange
   * @return {Range | null}
   */
  intersectionRange (otherRange) {
    if (this.isIntersect(otherRange)) {
      const range = this.cloneRange();
      if (range.compareBoundaryPoints(otherRange.START_TO_START, otherRange) === -1) {
        range.setStart(otherRange.startContainer, otherRange.startOffset);
      }

      if (range.compareBoundaryPoints(otherRange.END_TO_END, otherRange) === 1) {
        range.setEnd(otherRange.endContainer, otherRange.endOffset);
      }

      return range;
    }

    return null;
  }

}
