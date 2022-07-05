'use strict'

import { dom, createHighlighter } from '@/index';
import contextMenu from '@components/contextMenu';
import { UPDATE_MARKS, ADD_ANNOTATION } from './event/event';
import './components/aside';
import './components/nav';
import './components/annotations';
import './canvas/canvas';
import { highlighterPink } from './pen';
import './app.scss';

const highlighterCarnation = createHighlighter('carnation', {
  elProps: {
    onclick: (e) => {
      if (window.confirm('remove highlight')) {
        const highlight = highlighterCarnation.getHighlightFromElement(e.target);
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
      const event = new CustomEvent(UPDATE_MARKS, {
        detail: highlights
      });
      dom.gE('.book_aside_wrapper').dispatchEvent(event);
    }
  }, {
    name: 'annotation',
    click: () => {
      const [highlight] = highlighterPink.highlightSelection();
      const event = new CustomEvent(ADD_ANNOTATION, {
        detail: highlight
      });
      dom.gE('.book_annotations').dispatchEvent(event);
    }
  }]
)
