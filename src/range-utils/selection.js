// @flow
'use strict'

export function getSelection (sel?: any): Selection {
  if (sel instanceof Selection) {
    return sel;
  }

  return window.getSelection();
}

export function getRangesInSelection (selection: Selection): Range[] {
  const ranges = [];
  for (let i = 0; i < selection.rangeCount; ++i) {
    ranges.push(selection.getRangeAt(i));
  }

  return ranges;
}