'use strict'

import { createHighlighter, createApplier } from '@/index';
import createContextMenu from '../common/contextMenu';
import './app.scss';

const highlighter = createHighlighter();
const applier = createApplier();

createContextMenu(
  '.book',
  [
    {
      name: 'highlightSelection',
      click: () => {
        const highlights = highlighter.highlightSelection();
        console.log(highlights);
      }
    },
    {
      name: 'unhighlightSelection',
      click: () => {
        const highlights = highlighter.unhighlightSelection();
        console.log(highlights);
      }
    },
    {
      name: 'appliesToRange',
      click: () => {
        const [range] = window.getSelection().getAllRange();
        applier.applies(range);
      }
    },
    {
      name: 'unAppliesToRange',
      click: () => {
        const [range] = window.getSelection().getAllRange();
        applier.unApplies(range);
      }
    },
    {
      name: 'isAppliedToRange',
      click: () => {
        const [range] = window.getSelection().getAllRange();
        console.log(applier.isApplied(range), 'isAppliedToRange');
      }
    }
  ]
);
