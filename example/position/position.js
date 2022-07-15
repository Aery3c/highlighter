import Highlighter, { utils, dom } from '@';
import '../init.scss';
import '../layout.scss';

utils.extend(Range.prototype, {
  getBoundingDocumentRect: function () {
    const scrollPos = dom.getScrollPosition(dom.getWin(this.startContainer));
    return createRelativeRect(this.getBoundingClientRect(), scrollPos.x, scrollPos.y);
  }
})

/**
 *
 * @param {DOMRect} rect
 * @param {number} dx
 * @param {number} dy
 */
function createRelativeRect (rect, dx, dy) {
  return DOMRect.fromRect({ x: rect.left + dx, y: rect.top + dy, width: rect.width, height: rect.height });
}

var wholeSelRectEl, startSelEl, endSelEl;
document.addEventListener('mouseup', function () {
  console.log('mouseup');
  const [range] = Highlighter.getAllRangeInSelection(window.getSelection());

  Highlighter.getRangeBoundingClientRect(range);

});

