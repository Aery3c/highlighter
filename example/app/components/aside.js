'use strict'

import { dom } from '@/index';
import { UPDATE_MARKS } from '../event/event';
import { getScrollTop } from '../utils';
import './aside.scss';

const container = dom.gE('.book_aside_wrapper');

container.addEventListener(UPDATE_MARKS, (e) => {
  const { detail: highlights } = e;
  if (container.hasChildNodes()) {
    // remove existing marks
    let child;
    while ((child = container.querySelector('.book_aside_mark'))) {
      dom.removeNode(child);
    }
  }
  // add marks
  highlights.forEach(ht => container.appendChild(createMarkContainer(ht)));
});

container.addEventListener('click', () => {
  dom.toggleClass(container, 'book_aside_wrapper_active');
  dom.toggleClass(document.querySelector('.book_aside'), 'book_aside_active');
  dom.toggleClass(document.querySelector('.book_aside > aside'), 'book_aside_active');
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
  child.addEventListener('click', function (e) {
    e.stopPropagation();
    const range = highlight.characterRange.toRange();
    const rect = range.getBoundingClientRect();
    window.scrollTo({ top: getScrollTop() + rect.y - (window.innerHeight / 2), left: 0, behavior: 'smooth' });
  });
  el.appendChild(child);
  return el;
}