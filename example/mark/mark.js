/**
 * highlight selection, It is implemented through the browser api (window.getSelection)
 */

'use strict'

import { createPopper } from '@popperjs/core';
import { Highlighter } from '@';

const dropdownMenu = document.querySelector('.dropdown-menu'),
  container = document.getElementsByTagName('article')[0],
  button = document.querySelector('.dropdown-item'),
  tooltip = document.querySelector('#tooltip');

const generateClientRect = (x = 0, y = 0) => new DOMRect(x, y, 0, 0);

const virtualElement = {
  getBoundingClientRect: () => generateClientRect(-1000)
};

const popper = createPopper(
  virtualElement,
  dropdownMenu,
  {
    placement: 'bottom-start',
    modifiers: [{ name: 'eventListeners', options: { scroll: false } }]
  }
);

const popper2 = createPopper(
  virtualElement,
  tooltip,
  {
    placement: 'top',
    modifiers: [{ name: 'eventListeners', options: { scroll: false } }]
  }
);

container.addEventListener('mouseup', event => {
  const sel = window.getSelection(), range = sel.getRangeAt(0);

  if (!range.collapsed && range.toString() !== '') {
    const { x, y } = event;
    // flew in
    virtualElement.getBoundingClientRect = () => generateClientRect(x, y);
  }

  popper.forceUpdate();
});

container.addEventListener('mousedown', _ => {
  // eject
  virtualElement.getBoundingClientRect = () => generateClientRect(-1000, 0);
  popper.forceUpdate();
  virtualElement.getBoundingClientRect = () => generateClientRect(-1000, 0);
  popper2.forceUpdate();
});

const highlighter = new Highlighter();
button.addEventListener('click', () => {
  highlighter.highlightASelection();
  virtualElement.getBoundingClientRect = () => generateClientRect(-1000, 0);
  popper.forceUpdate();
});


let highlight;
highlighter.on('click', (ht) => {

  highlight = ht;
  const range = ht.characterRange.toRange();
  const rect = range.getBoundingClientRect();

  virtualElement.getBoundingClientRect = () => generateClientRect(rect.x + (rect.width / 2), rect.y);
  popper2.forceUpdate();
});

tooltip.addEventListener('mouseup', function () {
  highlighter.removeHighlight(highlight);
  virtualElement.getBoundingClientRect = () => generateClientRect(-1000, 0);
  popper2.forceUpdate();
});
