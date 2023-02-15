/**
 * highlight selection, It is implemented through the browser api (window.getSelection)
 */

// @flow
'use strict'

// $FlowIgnore
import { createPopper } from '@popperjs/core';
import { Highlighter } from '../../src';

const dropdownMenu = document.querySelector('.dropdown-menu'),
  container = document.getElementsByTagName('article')[0],
  markButton = document.querySelector('.mark-button'),
  underLineButton = document.querySelector('.underline-button'),
  tooltip = document.querySelector('#tooltip');

const generateClientRect = (x?: number = 0, y?: number = 0) => new DOMRect(x, y, 0, 0);

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

container.addEventListener('mouseup', (event: MouseEvent) => {
  const sel = window.getSelection(), range = sel.getRangeAt(0);

  if (!range.collapsed && range.toString() !== '') {
    const { x, y } = event;
    // flew in
    virtualElement.getBoundingClientRect = () => generateClientRect(x, y);
  }

  popper.forceUpdate();
});

container.addEventListener('mousedown', () => {
  // eject
  virtualElement.getBoundingClientRect = () => generateClientRect(-1000, 0);
  popper.forceUpdate();
  virtualElement.getBoundingClientRect = () => generateClientRect(-1000, 0);
  popper2.forceUpdate();
});

const highlighter = new Highlighter({ normalize: false });
markButton?.addEventListener('click', () => {
  highlighter.useSelection();
  console.log(highlighter.highlights);
  virtualElement.getBoundingClientRect = () => generateClientRect(-1000, 0);
  popper.forceUpdate();

  window.getSelection().removeAllRanges();
});

const underline = new Highlighter({ className: 'underline', normalize: false })

underLineButton?.addEventListener('click', () => {
  underline.useSelection();
  virtualElement.getBoundingClientRect = () => generateClientRect(-1000, 0);
  popper.forceUpdate();

  window.getSelection().removeAllRanges();
});

let highlight;
highlighter.on('click', (ht) => {

  highlight = ht;
  const range = ht.characterRange.toRange();
  const rect = range.getBoundingClientRect();

  virtualElement.getBoundingClientRect = () => generateClientRect(rect.x + (rect.width / 2), rect.y);
  popper2.forceUpdate();
});

underline.on('click', (ht) => {
  highlight = ht;
  const range = ht.characterRange.toRange();
  const rect = range.getBoundingClientRect();

  virtualElement.getBoundingClientRect = () => generateClientRect(rect.x + (rect.width / 2), rect.y);
  popper2.forceUpdate();
})

tooltip?.addEventListener('mouseup', function () {
  highlighter.removeHighlight(highlight);
  underline.removeHighlight(highlight);
  virtualElement.getBoundingClientRect = () => generateClientRect(-1000, 0);
  popper2.forceUpdate();
});
