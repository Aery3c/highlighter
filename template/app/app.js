'use strict'

import { createHighlighter, dom } from '@/index';
import contextMenu from '@components/contextMenu';
import './app.scss';

// create highlighter
const highlighter = createHighlighter('highlight', {
  elProps: {
    onclick: (e) => {
      // const highlight = highlighter.getHighlightForNode(e.target);
      // highlighter.removeHighlights([highlight]);
    }
  }
});

// create contextMenu
contextMenu('.book_container',
[
  {
    name: 'highlightSelection',
    click: () => {
      const highlights = highlighter.highlightSelection();
      /**
       * create custom events
       * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
       * @type {CustomEvent<unknown>}
       */
      // const markEvent = new CustomEvent(MARK_EVENT, {
      //   detail: highlights
      // });
      // container.dispatchEvent(markEvent);
      highlights.forEach(ht => ht.inspect());
    }
  },
  {
    name: 'unhighlightSelection',
    click: () => {
      const highlights = highlighter.unhighlightSelection();
      // const markEvent = new CustomEvent(MARK_EVENT, {
      //   detail: highlights
      // });
      // container.dispatchEvent(markEvent);
      highlights.forEach(ht => ht.inspect());
    }
  }
]);

// launch aside
const container = document.querySelector('.book_aside_wrapper');
container?.addEventListener('click', (e) => {
  dom.toggleClass(e.target, 'book_aside_wrapper_active');
  dom.toggleClass(document.querySelector('.book_aside'), 'book_aside_active');
  dom.toggleClass(document.querySelector('.book_aside > aside'), 'book_aside_active');
});

const MARK_EVENT = 'mark';
container?.addEventListener(MARK_EVENT, (e) => {
  const { detail: highlights } = e;
  if (container.hasChildNodes()) {
    // remove existing marks
    let child;
    while ((child = container.firstChild)) {
      dom.removeNode(child);
    }
  }
  // add marks
  highlights.forEach(ht => container.appendChild(createMarkContainer(ht)));
});

/**
 *
 * @param {Highlight} highlight
 * @return {HTMLDivElement}
 */
function createMarkContainer (highlight) {
  const el = document.createElement('div');
  dom.addClass(el, 'book_aside_mark');
  const child = document.createElement('button');
  dom.addClass(child, 'book_aside_mark_content');
  child.appendChild(document.createTextNode(highlight.characterRange.toRange().toString()));
  el.appendChild(child);
  return el;
}






