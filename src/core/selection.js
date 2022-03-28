'use strict'
/** @this Selection */
Selection.prototype.getAllRange = function () {
  const ranges = [];
  for (let i = 0; i < this.rangeCount; ++i) {
    ranges.push(this.getRangeAt(i));
  }
  return ranges;
}

Selection.prototype.isBackward = function () {
  let isBackward = false, anchorNode = this.anchorNode, focusNode = this.focusNode;
  if (!this.isCollapsed && anchorNode) {
    isBackward = !!(anchorNode.compareDocumentPosition(focusNode) & 2);
  }

  return isBackward;
}
