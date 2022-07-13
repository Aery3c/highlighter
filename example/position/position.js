import { utils, dom } from '@';
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

  const range = window.getSelection().getRangeAt(0);

  const wholeSelRect = range.getBoundingDocumentRect();

  wholeSelRectEl = document.createElement('div');
  wholeSelRectEl.id = 'wholeSelection';

  var wholeSelRectInnerEl = wholeSelRectEl.appendChild(document.createElement('div'));
  wholeSelRectInnerEl.id = 'wholeSelectionInner';

  utils.extend(wholeSelRectEl.style, {
    left: wholeSelRect.left + 'px',
    top: wholeSelRect.top + 'px'
  });

  utils.extend(wholeSelRectInnerEl.style, {
    width: wholeSelRect.width + 'px',
    height: wholeSelRect.height + 'px'
  });

  document.body.appendChild(wholeSelRectEl);



});