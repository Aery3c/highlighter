'use strict'

import { createHighlighter, dom } from '@/index';
import contextMenu from '@components/contextMenu';
import './app.scss';

// create contextMenu
contextMenu('.book_container',
[
  {
    name: 'highlightSelection',
    click: () => {
      const highlights = highlighter.highlightSelection();
      console.clear();
      highlights.forEach(ht => ht.inspect());
    }
  },
  {
    name: 'unhighlightSelection',
    click: () => {
      const highlights = highlighter.unhighlightSelection();
      console.clear();
      highlights.forEach(ht => ht.inspect());
    }
  }
]);

// create highlighter
const highlighter = createHighlighter('highlight', {
  elProps: {
    onclick: (e) => {
      const highlight = highlighter.getHighlightForNode(e.target);
      highlighter.removeHighlights([highlight]);
    }
  }
});

// launch aside
document.querySelector('.book_aside_wrapper')?.addEventListener('click', (e) => {
  dom.toggleClass(e.target, 'book_aside_wrapper_active');
  dom.toggleClass(document.querySelector('.book_aside'), 'book_aside_active');
  dom.toggleClass(document.querySelector('.book_aside > aside'), 'book_aside_active');
});






