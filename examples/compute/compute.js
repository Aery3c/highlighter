// @flow

/* eslint-disable */
import Highlight from '../../src/utils/highlight';
import Refills from '../../src/refills';
import { CharacterRange } from "../../src";

const start = (document.querySelector('#start'): any);
const end = (document.querySelector('#end'): any);
const range = document.createRange();

range.setStartBefore(start);
range.setEndAfter(end);
const highlight = new Highlight(CharacterRange.fromRange(range, range.commonAncestorContainer.ownerDocument), new Refills());
highlight.on();
const res = compute(range, {});
res.forEach(({ el, top, left }) => {
  el.scrollTo({ top, left, behavior: 'smooth' });
});

type Options = {|
  scrollMode?: 'always' | 'if-needed';
  block?: 'center' | 'end' | 'nearest' | 'start';
  inline?: 'center' | 'end' | 'nearest' | 'start';
|}

function compute (target: Range, options: Options) {
  const { block, inline } = options;
  // Used to handle the top most element that can be scrolled
  let scrollingElement = document.scrollingElement || document.documentElement;

  // Collect all the scrolling boxes, as defined in the spec: https://drafts.csswg.org/cssom-view/#scrolling-box
  let frames: Element[] = [];
  let cursor = isElement(target.commonAncestorContainer);
  while (!!cursor) {
    if (cursor === scrollingElement) {
      frames.push(cursor);
      break;
    }

    if (isScrollable(cursor)) {
      frames.push(cursor);
    }
    // $FlowIgnore
    cursor = cursor.parentElement;
  }
  let viewportWidth = window.visualViewport?.width ?? window.innerWidth;
  let viewportHeight = window.visualViewport?.height ?? window.innerHeight;
  let { scrollX, scrollY } = window

  let {
    height: targetHeight,
    width: targetWidth,
    top: targetTop,
    right: targetRight,
    bottom: targetBottom,
    left: targetLeft,
  } = target.getBoundingClientRect();

  let targetBlock: number =
    block === 'start' || block === 'nearest'
      ? targetTop
      : block === 'end'
        ? targetBottom
        : targetTop + targetHeight / 2 // block === 'center

  let targetInline: number =
    inline === 'center'
      ? targetLeft + targetWidth / 2
      : inline === 'end'
        ? targetRight
        : targetLeft // inline === 'start || inline === 'nearest

  const computations = [];
  frames.forEach(frame => {
    let blockScroll: number = 0
    let inlineScroll: number = 0
    if (frame === scrollingElement) {
      if (block === 'start') {
        blockScroll = targetBlock
      } else if (block === 'end') {
        blockScroll = targetBlock - viewportHeight
      } else if (block === 'nearest') {
        // blockScroll = alignNearest(
        //   scrollY,
        //   scrollY + viewportHeight,
        //   viewportHeight,
        //   borderTop,
        //   borderBottom,
        //   scrollY + targetBlock,
        //   scrollY + targetBlock + targetHeight,
        //   targetHeight
        // )
      } else {
        // block === 'center' is the default
        blockScroll = targetBlock - viewportHeight / 2
      }
      blockScroll = Math.max(0, blockScroll + scrollY)
      inlineScroll = Math.max(0, inlineScroll + scrollX)
    } else {
      // blockScroll = targetBlock - (top + height / 2) + scrollbarHeight / 2
    }

    computations.push({ el: frame, top: blockScroll, left: inlineScroll })
  })
  console.log(computations);
  return computations;
}

function isElement (el: any): Element | null {
  if (el && el.nodeType === Node.ELEMENT_NODE) {
    return el;
  }

  return null
}

function canOverflow (overflow: 'visible' | 'hidden' | 'clip' | 'scroll' | 'auto'): boolean {
  if (overflow === 'hidden') return false;

  return overflow !== 'visible' && overflow !== 'clip';
}

function isScrollable (el: Element): boolean {
  if (el.clientHeight < el.scrollHeight || el.clientWidth < el.scrollWidth) {
    const style = window.getComputedStyle(el);

    return (
      canOverflow(style.overflowY) || canOverflow(style.overflowX)
    );
  }

  return false;
}
