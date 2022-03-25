'use strict'

export default {
  /**
   *
   * @return {Range[]}
   */
  getAllRange () {
    /** @this Selection */
    const ranges = [];
    for (let i = 0; i < this.rangeCount; ++i) {
      ranges.push(this.getRangeAt(i));
    }
    return ranges;
  },
  /**
   *
   * @return {boolean}
   */
  isBackward () {
    /** @this Selection */
    let isBackward = false, anchorNode = this.anchorNode, focusNode = this.focusNode;
    if (!this.isCollapsed && anchorNode) {
      isBackward = !!(anchorNode.compareDocumentPosition(focusNode) & 2);
    }

    return isBackward;
  }
}
