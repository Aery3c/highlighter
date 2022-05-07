'use strict'

import Highlighter from "@/index";
import createContextMenu from './contextMenu';
import './app.scss';

const highlighter = new Highlighter();

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
    }
  ]
);
