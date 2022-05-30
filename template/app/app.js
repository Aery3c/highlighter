'use strict'

import { createHighlighter } from '@/index';
import createContextMenu from '../common/contextMenu';
import './app.scss';

const highlighter = createHighlighter('highlight', {
  elProps: {
    onclick: (e) => {
      const highlight = highlighter.getHighlightForNode(e.target);

    }
  }
});

createContextMenu(
  '.book',
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
  ]
);
