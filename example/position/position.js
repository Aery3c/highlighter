import { utils, dom } from '@';
import '../init.scss';
import '../layout.scss';

/**
 *
 * @param {Window} win
 */
function getScrollPosition (win) {
  console.log(win);
}

utils.extend(Range.prototype, {
  getBoundingDocumentRect: function () {
    const scrollPos = getScrollPosition(dom.getWin(this.startContainer));
  }
})

document.addEventListener('mouseup', function () {
  const range = window.getSelection().getRangeAt(0);
  range.getBoundingDocumentRect();
});