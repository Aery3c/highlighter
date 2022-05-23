'use strict'

import { createPopper } from '@popperjs/core';
import { dom } from '@/index';
import './styles.scss';

const { addClass, toggleClass, removeClass } = dom;
/**
 *
 * @param {string} [selector]
 * @param {{ name: string; click: (e: MouseEvent) => void }[]} [items]
 * @returns {Element}
 */
export default (selector, items) => {

  const fragment = document.createDocumentFragment();
  const menu = document.createElement('ul');
  addClass(menu, 'context_menu');

  items.forEach(item => {
    const li = document.createElement('li');
    addClass(li, 'context_menu_item');
    li.innerHTML = `
      <span class="context_menu_item_icon">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-${item.name}"></use>
        </svg>
      </span>
      <span class="context_menu_item_content">${item.name}</span>
    `;

    li.addEventListener('click', (e) => {
      item.click(e);
      virtualElement.getBoundingClientRect = () => generateGetBoundingClientRect(pos, 0);
      popper.forceUpdate();
    });

    ['mousedown', 'mouseup'].forEach(event => {
      li.addEventListener(event, e => e.stopPropagation());
    });

    ['mouseover', 'mouseout'].forEach(event => {
      li.addEventListener(event, () => toggleClass(li, 'context_menu_item_selected'));
    });

    menu.appendChild(li);
  });

  fragment.append(menu);

  const bookContent = getElement(selector);

  bookContent.appendChild(fragment);

  const pos = -312; // init position

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
      addClass(menu, 'context_menu_fadeIn');
      const { x, y } = event;
      // flew in
      virtualElement.getBoundingClientRect = () => generateGetBoundingClientRect(x, y);
    }

    popper.forceUpdate();
  });

  document.addEventListener('mousedown', _ => {
    removeClass(menu, 'context_menu_fadeIn');
    // prevent click selection flew in
    selection.removeAllRanges();
    virtualElement.getBoundingClientRect = () => generateGetBoundingClientRect(pos, 0);
    popper.forceUpdate();
  });

  /**
   *
   * @param {string} selector
   * @returns {Element | null}
   */
  function getElement (selector) {
    return document.querySelector(selector) || document.body;
  }

  return menu;
};
