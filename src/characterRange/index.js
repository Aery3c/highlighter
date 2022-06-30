/**
 * 在容器上下文中表示一段字符的范围
 */
'use strict'

class CharacterRange {
  constructor (start = 0, end = 0) {
    this.start = start;
    this.end = end;
  }

  /**
   * range产生交集的部分, 一个新的range
   * @param {CharacterRange} characterRange
   * @return {CharacterRange | null}
   */
  intersection (characterRange) {
    if (this.isIntersects(characterRange)) {
      return new CharacterRange(Math.max(this.start, characterRange.start), Math.min(this.end, characterRange.end));
    }
    return null;
  }

  /**
   * 如果范围产生交集, 返回true, 否则false
   * @param {CharacterRange} characterRange
   * @return {boolean}
   */
  isIntersects (characterRange) {
    return this.start < characterRange.end && this.end > characterRange.start;
  }

  /**
   * range是否是相邻的
   * @param {CharacterRange} characterRange
   * @return {boolean}
   */
  isAdjoin (characterRange) {
    return this.start === characterRange.end || this.end === characterRange.start
  }

  /**
   * 两个range是否完全重叠在一起
   * @param characterRange
   * @return {boolean}
   */
  isOverlap (characterRange) {
    return this.start === characterRange.start && this.end === characterRange.end;
  }

  /**
   * range之间的并集, 返回一个新的range
   * @param {CharacterRange} characterRange
   * @return {CharacterRange | null}
   *
   */
  union (characterRange) {
    if (this.isIntersects(characterRange) || this.isAdjoin(characterRange)) {
      return new CharacterRange(Math.min(this.start, characterRange.start), Math.max(this.end, characterRange.end));
    }
    return null
  }

  /**
   * range是否包含另一个range
   * @param {CharacterRange} characterRange
   * @return {boolean}
   */
  contains (characterRange) {
    return this.start <= characterRange.start && this.end >= characterRange.end;
  }


  /**
   * 补集, 返回一组新的range
   * @param {CharacterRange} characterRange
   * @return {CharacterRange[]}
   */
  complementarySet (characterRange) {
    const characterRanges = [];

    if (this.start < characterRange.start) {
      characterRanges.push(new CharacterRange(this.start, characterRange.start));
    }

    if (this.end > characterRange.end) {
      characterRanges.push(new CharacterRange(characterRange.end, this.end));
    }

    return characterRanges;
  }

  /**
   *
   * @param {number} offset
   */
  setStart (offset) {
    this.start = offset;
  }

  /**
   *
   * @param {number} offset
   */
  setEnd (offset) {
    this.end = offset;
  }

  /**
   * to range
   * @param {HTMLElement} [containerElement]
   * @return {Range}
   */
  toRange (containerElement) {
    const range = document.createRange();
    range.moveToCharacterRange(this, containerElement);
    return range;
  }

}

export default CharacterRange;