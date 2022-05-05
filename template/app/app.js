'use strict'

import Highlighter from "@/index";
import createContextMenu from './contextMenu';
import './app.scss';

const higlighter = new Highlighter();

createContextMenu(
  '.book',
  [
    {
      name: 'highlightSelection',
      click: () => {
        const highlights = higlighter.highlightSelection();
        console.log(highlights);
      }
    },
    {
      name: 'unhighlightSelection',
      click: () => {
        const highlights = higlighter.unhighlightSelection();
      }
    }
  ]
);
