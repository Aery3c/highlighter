'use strict'

import '@/core/selection';
import { createPopper } from '@popperjs/core';
import { toggleClass, addClass } from '@/dom';
import './styles.scss';

/**
 *
 * @param {string} selector
 * @param {{ name: string; click: (e: Event) => void }[]} items
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

    li.addEventListener('click', item.click,);

    ['mouseover', 'mouseout'].forEach(event => {
      li.addEventListener(event, () => toggleClass(li, 'context_menu_item_active'));
    });

    menu.appendChild(li);
  });

  fragment.append(menu);

  const bookContent = getElement(selector);

  bookContent.appendChild(fragment);

  const pos = 0; // init position

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
  });

  document.body.addEventListener('mousedown', _ => {
    if (!selection.rangeCount && selection.isCollapsed) {
      // // prevent click selection flew in
      // selection.removeAllRanges();
      // eject
      virtualElement.getBoundingClientRect = () => generateGetBoundingClientRect(pos, 0);
      popper.forceUpdate();
    }
  });

  /**
   *
   * @param {string} selector
   * @returns {Element | null}
   */
  function getElement (selector) {
    return document.querySelector(selector);
  }

  return menu;
};
