'use strict'

import { createPopper } from '@popperjs/core';
import './styles.scss';

function getElement (selector) {
  return document.querySelector(selector);
}

const pos = 0; // init position

const bookContent = getElement('.book_content');
const referToElement = getElement('.book_context_menu');

const generateGetBoundingClientRect = (x = 0, y = 0) => new DOMRect(x, y, 0, 0);
const virtualElement = {
  getBoundingClientRect: () => generateGetBoundingClientRect(pos, 0)
};

const popper = createPopper(
  virtualElement,
  referToElement,
  {
    placement: 'bottom-start',
    modifiers: [{ name: 'eventListeners', options: { scroll: false } }]
  }
);

const selection = window.getSelection();

bookContent.addEventListener('mouseup', event => {
  const ranges = selection.getAllRange();
  const range = ranges[ranges.length - 1];

  if (!range.collapsed && range.toString() !== '') {
    const { x, y } = event;
    // flew in
    virtualElement.getBoundingClientRect = () => generateGetBoundingClientRect(x, y);
  }

  popper.forceUpdate();
}, false);

document.addEventListener('mousedown', _ => {
  // eject
  virtualElement.getBoundingClientRect = () => generateGetBoundingClientRect(pos, 0);
  popper.forceUpdate();
}, false);

