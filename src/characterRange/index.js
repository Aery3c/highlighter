/**
 * 在容器上下文中表示一段字符的范围
 */
'use strict'

class CharacterRange {
  /**
   *
   * @param {number} start
   * @param {number} end
   * @param {HTMLElement} containerElement
   */
  constructor (start = 0, end = 0, containerElement = document.body) {
    this.start = start;
    this.end = end;
    this.containerElement = containerElement;
  }

  /**
   * 返回两段范围产生交集的部分, 返回一个新的范围
   * @param {CharacterRange} otherCharRange
   * @return {CharacterRange}
   */
  intersection (otherCharRange) {
    return new CharacterRange(Math.max(this.start, otherCharRange.start), Math.min(this.end, otherCharRange.end));
  }

  /**
   * 如果range产生交集, 返回true, 否则false
   * @param {CharacterRange} otherCharRange
   * @return {boolean}
   */
  isIntersects (otherCharRange) {
    return this.start < otherCharRange.end && this.end > otherCharRange.start;
  }

  /**
   * range是否是相邻的
   * @param {CharacterRange} otherCharRange
   * @return {boolean}
   */
  isAdjoin (otherCharRange) {
    return this.start === otherCharRange.end || this.end === otherCharRange.start
  }

  /**
   * 两个range是否完全重叠在一起
   * @param otherCharRange
   * @return {boolean}
   */
  isOverlap (otherCharRange) {
    return this.start === otherCharRange.start && this.end === otherCharRange.end;
  }

  /**
   * 并集, 返回一个新的range
   * @param {CharacterRange} otherCharRange
   * @return {CharacterRange}
   *
   */
  union (otherCharRange) {
    return new CharacterRange(Math.min(this.start, otherCharRange.start), Math.max(this.end, otherCharRange.end));
  }

  /**
   * 补集, 返回一组新的range
   * @param {CharacterRange} subCharRange
   * @return {CharacterRange[]}
   */
  complementarySet (subCharRange) {
    const charSet = [];

    if (this.start < subCharRange.start) {
      charSet.push(new CharacterRange(this.start, subCharRange.start));
    }

    if (this.end > subCharRange.end) {
      charSet.push(new CharacterRange(subCharRange.end, this.end));
    }

    return charSet;
  }

  setStart (offset) {
    this.start = offset;
  }

  setEnd (offset) {
    this.end = offset;
  }
}

export default CharacterRange;