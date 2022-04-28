'use strict'

import Highlighter from "@/index";
import createContextMenu from './contextMenu';
import './app.scss';

const higlighter = new Highlighter({});

createContextMenu(
  '.book',
  [{
    name: 'highlighter',
    click: () => {
      console.log('run this');
      const highlights = higlighter.highlightSelection();
      console.log(highlights);
    }
  }]
);

document.addEventListener('selectstart', function () {
  console.log('selectstart');
});
