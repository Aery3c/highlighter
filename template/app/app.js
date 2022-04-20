'use strict'

import { createPopper } from '@popperjs/core';
import Highlighter from '@/index';
import './app.scss';

(function() {

  function overflow () {
    return new DOMRect(0, -100, 0, 0)
  }

  const virtualElement = {
    getBoundingClientRect: () => overflow()
  };

  const instance = createPopper(virtualElement, document.querySelector('.book_context_menu'), {
    placement: 'bottom-start'
  });

  document.querySelector('.book_content').addEventListener('mouseup', (event) => {
    console.log(event);

    const range = window.getSelection().getRangeAt(0);
    if (!range.collapsed) {
      virtualElement.getBoundingClientRect = () => range.getBoundingClientRect();
    } else {
      virtualElement.getBoundingClientRect = () => overflow();
    }

    instance.update();

  }, false);

})();
