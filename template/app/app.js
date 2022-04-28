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
        higlighter.highlightSelection();
      }
    },
    {
      name: 'unhighlightSelection',
      click: () => {
        higlighter.unhighlightSelection();
      }
    }
  ]
);