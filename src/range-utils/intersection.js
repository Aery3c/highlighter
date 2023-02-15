// @flow
'use strict'

/**
 * Returns the part of a specified range that intersects another range
 */
export function getIntersectionRange (rangeA: Range, rangeB: Range): Range | null {
  if (intersectsRange(rangeA, rangeB)) {
    const range = rangeA.cloneRange();
    // $FlowIgnore
    if (range.compareBoundaryPoints(rangeB.START_TO_START, rangeB) === -1) {
      range.setStart(rangeB.startContainer, rangeB.startOffset);
    }
    // $FlowIgnore
    if (range.compareBoundaryPoints(rangeB.END_TO_END, rangeB) === 1) {
      range.setEnd(rangeB.endContainer, rangeB.endOffset);
    }

    return range;
  }

  return null;
}

/**
 * Returns a boolean indicating whether the given Range intersects the Range.
 */
export function intersectsRange (rangeA: Range, rangeB: Range): boolean {
  // rangeA.s < rangeB.e;
  // $FlowIgnore
  const start = rangeA.compareBoundaryPoints(rangeB.END_TO_START, rangeB);
  // rangeA.e > rangeB.s;
  // $FlowIgnore
  const end = rangeA.compareBoundaryPoints(rangeB.START_TO_END, rangeB);

  return start < 0 && end > 0;
}