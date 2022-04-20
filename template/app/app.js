'use strict'

import { createPopper } from '@popperjs/core';
import Highlighter from '@/index';
import { getElement, generateGetBoundingClientRect } from './utils';
import './app.scss';

(function() {
  const contentElement = getElement('.book_content'), popperElement = getElement('.book_context_menu');
  const popWidth = -popperElement.clientWidth;

  const virtualElement = {};

  function setPosition (x = 0, y = 0) {
    virtualElement.getBoundingClientRect = () => generateGetBoundingClientRect(x, y);
  }

  setPosition(popWidth, 0);

  const instance = createPopper(virtualElement, popperElement, {
    placement: 'bottom-start',
    modifiers: [{
      name: 'eventListeners',
      options: {
        scroll: false
      }
    }]
  });

  [['mouseup', flew], ['mousedown', eject]].forEach(([event, func]) => {
    contentElement.addEventListener(event, func, false);
  });

  function flew (event) {
    const sel = window.getSelection();
    const range = sel.getRangeAt(0);
    if (!range.collapsed && range.toString() !== '') {
      const { x, y } = event;
      setPosition(x, y);
    } else {
      setPosition(popWidth, 0);
    }

    instance.forceUpdate();
  }

  function eject () {
    setPosition(popWidth, 0);
    instance.forceUpdate();
  }

})();
