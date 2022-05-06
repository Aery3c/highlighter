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
      }
    },
    {
      name: 'unhighlightSelection',
      click: () => {
        const highlights = higlighter.unhighlightSelection();
      }
    },
    {
      name: 'deleteContents',
      click: () => {
        const sel = window.getSelection();
        const [range] = sel.getAllRange();
        range.deleteContents();
        higlighter.update();
        higlighter.inspect();
      }
    },
    {
      name: 'insertNode',
      click: () => {
        const [range] = window.getSelection().getAllRange();
        range.insertNode(new Text('insertNode'));
        higlighter.update();
        higlighter.inspect();
      }
    }
  ]
);
