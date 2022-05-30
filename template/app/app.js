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
    },
    {
      name: 'isAppliedToRange',
      click: () => {
        const [range] = window.getSelection().getAllRange();
        console.log(applier.isAppliedToRange(range), 'isAppliedToRange');
      }
    }
  ]
);
