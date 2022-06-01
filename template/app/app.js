'use strict'

import { createHighlighter, dom, utils, createCharacterRange, createApplier, createHighlight } from '@/index';
import contextMenu from '@components/contextMenu';
import './app.scss';

const containerElement =  document.querySelector('.book_container');
// create highlighter
const highlighter = createHighlighter('highlight', {
  elProps: {
    onclick: (e) => {
      if (window.confirm('remove highlight')) {
        const highlight = highlighter.getHighlightForNode(e.target);
        highlighter.removeHighlights([highlight]);
        const event = new CustomEvent(UPDATE_MARKS, {
          detail: highlighter.highlights
        });
        container.dispatchEvent(event);
      }
    }
  },
  containerElement: containerElement
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
      const event = new CustomEvent(UPDATE_MARKS, {
        detail: highlights
      });
      container.dispatchEvent(event);
      highlights.forEach(ht => ht.inspect());
    }
  },
  {
    name: 'unhighlightSelection',
    click: () => {
      const highlights = highlighter.unhighlightSelection();
      const event = new CustomEvent(UPDATE_MARKS, {
        detail: highlights
      });
      container.dispatchEvent(event);
      highlights.forEach(ht => ht.inspect());
    }
  }
]);

// launch aside
const container = document.querySelector('.book_aside_wrapper');
container?.addEventListener('click', () => {
  dom.toggleClass(container, 'book_aside_wrapper_active');
  dom.toggleClass(document.querySelector('.book_aside'), 'book_aside_active');
  dom.toggleClass(document.querySelector('.book_aside > aside'), 'book_aside_active');
});

const UPDATE_MARKS = 'UPDATE_MARKS';
container?.addEventListener(UPDATE_MARKS, (e) => {
  const { detail: highlights } = e;
  if (container.hasChildNodes()) {
    // remove existing marks
    let child;
    while ((child = container.querySelector('.book_aside_mark'))) {
      dom.removeNode(child);
    }
  }
  // add marks
  highlights.sort((a, b) => a.characterRange.start - b.characterRange.start).forEach(ht => container.appendChild(createMarkContainer(ht)));
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

function getScrollTop () {
  return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
}

// set reader progress
const progressEl = document.querySelector('.book_nav_progress > div');
window.addEventListener('scroll', () => {
  const totalH = document.body.scrollHeight || document.documentElement.scrollHeight
  const clientH = window.innerHeight || document.documentElement.clientHeight
  const scrollH = getScrollTop();
  const validH = totalH - clientH
  const result = (scrollH / validH * 100).toFixed(2) - 100;
  progressEl.style.transform = `translateX(${result}%)`;
});


// input bind keyboard
const inputEl = document.querySelector('.book_nav_find_wrapper > input');

inputEl.addEventListener('keyup', debounce(() => {
  findText(inputEl.value);
}));

// create new applier
const applier = createApplier('find', {
  containerElement,
  onApplied: (el) => {
    // trigger applies doing
    // console.log(el);
  }
});

document.addEventListener('click', () => {
  highlights.forEach(ht => ht.unapply());
  highlights.length = 0;
});

const highlights = []
/**
 * 搜索并高亮
 * @param {string} text
 */
function findText (text) {
  highlights.forEach(ht => ht.unapply());
  highlights.length = 0;
  text = utils.stripAndCollapse(text);
  if (text !== '') {
    const fullText = containerElement.textContent,
      matchArr = [...fullText.matchAll(new RegExp(`${text}`, 'gi'))]

    matchArr.forEach(({ index: point }) => {
      highlights.push(createHighlight(createCharacterRange(point, point + text.length, containerElement), applier));
    });

    highlights.forEach((ht, index) => {
      if (index === 0) {
        const rect = ht.characterRange.toRange().getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) {
          // 元素没有在视口内, 跳转~~~
          window.scrollTo({ top: getScrollTop() + rect.y - (window.innerHeight / 2), left: 0, behavior: 'smooth' });
        }
      }
      ht.apply()
    });
  }
}

/**
 * debounce for input
 * @param callback
 * @param delay
 * @return {(function(): void)|*}
 */
function debounce (callback, delay = 1000) {
  let timer = null;
  return function () {
    let self = this;
    let args = arguments;
    timer && clearTimeout(timer)
    timer = setTimeout(function () {
      callback.apply(self, args)
    }, delay);
  }
}



