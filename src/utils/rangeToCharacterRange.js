// @flow
import CharacterRange from './characterRange';
import rangeUtils from '../range-utils';

export function rangeToCharacterRange (range: Range, referenceNod: Node): CharacterRange {
  const wrapRange = range.cloneRange();
  wrapRange.selectNodeContents(referenceNod);
  let start = 0, end = 0;
  const intersectionRange = rangeUtils.getIntersectionRange(wrapRange, range);
  if (intersectionRange) {
    wrapRange.setEnd(intersectionRange.startContainer, intersectionRange.startOffset);
    start = wrapRange.toString().length;
    end = start + intersectionRange.toString().length
  }
  return new CharacterRange(start, end);
}