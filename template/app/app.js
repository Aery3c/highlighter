'use strict'

import { createHighlighter } from '@/index';
import contextMenu from '@components/contextMenu';
import './app.scss';

// create contextMenu
contextMenu('.book',
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




