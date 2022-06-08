'use strict'

import { dom, createHighlighter } from '@/index';
import contextMenu from '@components/contextMenu';
import { UPDATE_MARKS } from './event/event';
import './components/aside';
import './components/nav';
import './app.scss';

const highlighterCarnation = createHighlighter('carnation', {
  elProps: {
    onclick: (e) => {
      if (window.confirm('remove highlight')) {
        const highlight = highlighterCarnation.getHighlightForNode(e.target);
        highlighterCarnation.removeHighlights([highlight]);
        const highlights = highlighterCarnation.getAllHighlight();
        const event = new CustomEvent(UPDATE_MARKS, {
          detail: highlights
        });
        dom.gE('.book_aside_wrapper').dispatchEvent(event);
      }
    }
  },
  containerElement: document.querySelector('.book_container')
});

contextMenu(
  '.book_container',
  [{
    name: 'highlightSelection',
    click: () => {
      highlighterCarnation.highlightSelection();
      const highlights = highlighterCarnation.getAllHighlight();
      const event = new CustomEvent(UPDATE_MARKS, {
        detail: highlights
      });
      dom.gE('.book_aside_wrapper').dispatchEvent(event);
    }
  }, {
    name: 'unhighlightSelection',
    click: () => {
      highlighterCarnation.unhighlightSelection()
      const highlights = highlighterCarnation.getAllHighlight();
      console.log(highlights);
      const event = new CustomEvent(UPDATE_MARKS, {
        detail: highlights
      });
      dom.gE('.book_aside_wrapper').dispatchEvent(event);
    }
  }]
)

