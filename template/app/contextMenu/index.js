'use strict'

import { createPopper } from '@popperjs/core';
import { toggleClass } from '@/dom';
import './styles.scss';

const pos = 0; // init position

const bookContent = getElement('.book_content');
const menu = getElement('.context_menu');

const generateGetBoundingClientRect = (x = 0, y = 0) => new DOMRect(x, y, 0, 0);
const virtualElement = {
  getBoundingClientRect: () => generateGetBoundingClientRect(pos, 0)
};

const popper = createPopper(
  virtualElement,
  menu,
  {
    placement: 'bottom-start',
    modifiers: [{ name: 'eventListeners', options: { scroll: false } }]
  }
);

const selection = window.getSelection();

bookContent?.addEventListener('mouseup', event => {
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

['mouseover', 'mouseout'].forEach(event => {
  Array.from(menu.children).forEach(el => {
    el.addEventListener(event, () => toggleClass(el, 'context_menu_item_active') , false);
  });
});
/**
 *
 * @param {string} selector
 * @returns {Element | null}
 */
function getElement (selector) {
  return document.querySelector(selector);
}