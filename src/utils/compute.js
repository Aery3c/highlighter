// @flow
'use strict'

export type Options = {|
  scrollMode?: 'always' | 'if-needed';
  block?: 'center' | 'end' | 'nearest' | 'start';
  inline?: 'center' | 'end' | 'nearest' | 'start';
|}

export type ScrollAction = {
  el: HTMLElement;
  top: number;
  left: number;
}

export function compute (target: Range, options: Options): ScrollAction[] {
  const { block, inline, scrollMode } = options;
  let scrollingElement = document.scrollingElement || document.documentElement;

  let frames: HTMLElement[] = [];
  let cursor = isElement(target.commonAncestorContainer);
  while (cursor) {
    if (cursor === scrollingElement) {
      frames.push(cursor);
      break;
    }

    if (
      cursor === document.body &&
      isScrollable(cursor) &&
      // $FlowIgnore
      !isScrollable(document.documentElement)
    ) {
      continue
    }

    if (cursor != null && isScrollable(cursor)) {
      frames.push(cursor)
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
        : targetTop + targetHeight / 2

  let targetInline: number =
    inline === 'center'
      ? targetLeft + targetWidth / 2
      : inline === 'end'
        ? targetRight
        : targetLeft

  const computations = [];
  frames.forEach(frame => {
    let { height, width, top, right, bottom, left } =
      frame.getBoundingClientRect()

    if (
      scrollMode === 'if-needed' &&
      targetTop >= 0 &&
      targetLeft >= 0 &&
      targetBottom <= viewportHeight &&
      targetRight <= viewportWidth &&
      targetTop >= top &&
      targetBottom <= bottom &&
      targetLeft >= left &&
      targetRight <= right
    ) {
      return computations
    }

    let frameStyle = getComputedStyle(frame)
    let borderLeft = parseInt(frameStyle.borderLeftWidth, 10)
    let borderTop = parseInt(frameStyle.borderTopWidth, 10)
    let borderRight = parseInt(frameStyle.borderRightWidth, 10)
    let borderBottom = parseInt(frameStyle.borderBottomWidth, 10)

    let blockScroll: number = 0
    let inlineScroll: number = 0

    let scrollbarWidth =
      'offsetWidth' in frame
        ? frame.offsetWidth -
        frame.clientWidth -
        borderLeft -
        borderRight
        : 0
    let scrollbarHeight =
      'offsetHeight' in frame
        ? frame.offsetHeight -
        frame.clientHeight -
        borderTop -
        borderBottom
        : 0

    let scaleX =
      'offsetWidth' in frame
        ? frame.offsetWidth === 0
          ? 0
          : width / frame.offsetWidth
        : 0
    let scaleY =
      'offsetHeight' in frame
        ? frame.offsetHeight === 0
          ? 0
          : height / frame.offsetHeight
        : 0


    if (scrollingElement === frame) {
      if (block === 'start') {
        blockScroll = targetBlock
      } else if (block === 'end') {
        blockScroll = targetBlock - viewportHeight
      } else if (block === 'nearest') {
        blockScroll = alignNearest(
          scrollY,
          scrollY + viewportHeight,
          viewportHeight,
          borderTop,
          borderBottom,
          scrollY + targetBlock,
          scrollY + targetBlock + targetHeight,
          targetHeight
        )
      } else {
        blockScroll = targetBlock - viewportHeight / 2
      }

      if (inline === 'start') {
        inlineScroll = targetInline
      } else if (inline === 'center') {
        inlineScroll = targetInline - viewportWidth / 2
      } else if (inline === 'end') {
        inlineScroll = targetInline - viewportWidth
      } else {
        inlineScroll = alignNearest(
          scrollX,
          scrollX + viewportWidth,
          viewportWidth,
          borderLeft,
          borderRight,
          scrollX + targetInline,
          scrollX + targetInline + targetWidth,
          targetWidth
        )
      }

      blockScroll = Math.max(0, blockScroll + scrollY)
      inlineScroll = Math.max(0, inlineScroll + scrollX)
    } else {
      if (block === 'start') {
        blockScroll = targetBlock - top - borderTop
      } else if (block === 'end') {
        blockScroll = targetBlock - bottom + borderBottom + scrollbarHeight
      } else if (block === 'nearest') {
        blockScroll = alignNearest(
          top,
          bottom,
          height,
          borderTop,
          borderBottom + scrollbarHeight,
          targetBlock,
          targetBlock + targetHeight,
          targetHeight
        )
      } else {
        blockScroll = targetBlock - (top + height / 2) + scrollbarHeight / 2
      }

      if (inline === 'start') {
        inlineScroll = targetInline - left - borderLeft
      } else if (inline === 'center') {
        inlineScroll = targetInline - (left + width / 2) + scrollbarWidth / 2
      } else if (inline === 'end') {
        inlineScroll = targetInline - right + borderRight + scrollbarWidth
      } else {
        inlineScroll = alignNearest(
          left,
          right,
          width,
          borderLeft,
          borderRight + scrollbarWidth,
          targetInline,
          targetInline + targetWidth,
          targetWidth
        )
      }

      let { scrollLeft, scrollTop } = frame
      blockScroll = Math.max(
        0,
        Math.min(
          scrollTop + blockScroll / scaleY,
          frame.scrollHeight - height / scaleY + scrollbarHeight
        )
      )
      inlineScroll = Math.max(
        0,
        Math.min(
          scrollLeft + inlineScroll / scaleX,
          frame.scrollWidth - width / scaleX + scrollbarWidth
        )
      )
      targetBlock += scrollTop - blockScroll
      targetInline += scrollLeft - inlineScroll
    }

    computations.push({ el: frame, top: blockScroll, left: inlineScroll })
  })
  return computations;
}

function isElement (el: any): HTMLElement | null {
  if (el && el.nodeType === Node.ELEMENT_NODE) {
    return el;
  }

  return null
}

function canOverflow (
  overflow: string | null,
) {
  if (overflow === 'hidden') {
    return false
  }

  return overflow !== 'visible' && overflow !== 'clip'
}

function isScrollable (el: HTMLElement): boolean {
  if (el.clientHeight < el.scrollHeight || el.clientWidth < el.scrollWidth) {
    let style = getComputedStyle(el)
    return (
      canOverflow(style.overflowY) ||
      canOverflow(style.overflowX) ||
      isHiddenByFrame(el)
    )
  }

  return false
}

function getFrameElement (el: HTMLElement) {
  if (!el.ownerDocument || !el.ownerDocument.defaultView) {
    return null
  }

  try {
    return el.ownerDocument.defaultView.frameElement
  } catch (e) {
    return null
  }
}

function isHiddenByFrame (el: HTMLElement): boolean {
  let frame = getFrameElement(el)
  if (!frame) {
    return false
  }

  return (
    frame.clientHeight < el.scrollHeight || frame.clientWidth < el.scrollWidth
  )
}

function alignNearest (
  scrollingEdgeStart: number,
  scrollingEdgeEnd: number,
  scrollingSize: number,
  scrollingBorderStart: number,
  scrollingBorderEnd: number,
  elementEdgeStart: number,
  elementEdgeEnd: number,
  elementSize: number
) {
  if (
    (elementEdgeStart < scrollingEdgeStart &&
      elementEdgeEnd > scrollingEdgeEnd) ||
    (elementEdgeStart > scrollingEdgeStart && elementEdgeEnd < scrollingEdgeEnd)
  ) {
    return 0
  }

  if (
    (elementEdgeStart <= scrollingEdgeStart && elementSize <= scrollingSize) ||
    (elementEdgeEnd >= scrollingEdgeEnd && elementSize >= scrollingSize)
  ) {
    return elementEdgeStart - scrollingEdgeStart - scrollingBorderStart
  }

  if (
    (elementEdgeEnd > scrollingEdgeEnd && elementSize < scrollingSize) ||
    (elementEdgeStart < scrollingEdgeStart && elementSize > scrollingSize)
  ) {
    return elementEdgeEnd - scrollingEdgeEnd + scrollingBorderEnd
  }

  return 0
}
