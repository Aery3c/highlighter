'use strict'

import { createHighlighter, createApplier } from '@/index';
import createContextMenu from '../common/contextMenu';
import './app.scss';

const highlighter = createHighlighter('highlight', {});
const applier = createApplier();

createContextMenu(
  '.book',
  [
    {
      name: 'highlightSelection',
      click: () => {
        const highlights = highlighter.highlightSelection();
        highlighter.inspect();
      }
    },
    {
      name: 'unhighlightSelection',
      click: () => {
        const highlights = highlighter.unhighlightSelection();
      }
    },
    {
      name: 'deleteContents',
      click: () => {
        const sel = window.getSelection();
        const [range] = sel.getAllRange();
        range.deleteContents();
        highlighter.inspect();
        highlighter.update();
      }
    },
    {
      name: 'insertNode',
      click: () => {
        const [range] = window.getSelection().getAllRange();
        range.insertNode(new Text('insertNode'));
        highlighter.inspect();
      }
    },
    {
      name: 'applyToRange',
      click: () => {
        const [range] = window.getSelection().getAllRange();
        applier.applyToRange(range);
      }
    },
    {
      name: 'undoToRange',
      click: () => {
        const [range] = window.getSelection().getAllRange();
        applier.undoToRange(range);
      }
    }
  ]
);
