'use strict'

import { createPopper } from '@popperjs/core';
import Highlighter from '@/index';
import './app.scss';

(function() {

  document.addEventListener('mouseup', () => {
    const range = window.getSelection().getRangeAt(0);

  }, false);

})();
