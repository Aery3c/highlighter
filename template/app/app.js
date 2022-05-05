'use strict'

import Highlighter from "@/index";
import createContextMenu from './contextMenu';
import './app.scss';

const higlighter = new Highlighter();

function insertText () {
  const el = document.querySelector('.book_content');
  const firstTextNode = el.firstChild.nextSibling.firstChild;
  firstTextNode.insertData(0, 'insert');
}

createContextMenu(
  '.book',
  [
    {
      name: 'highlightSelection',
      click: () => {
        const highlights = higlighter.highlightSelection();
        // insertText();
        higlighter.update();
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
