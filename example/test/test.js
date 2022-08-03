'use strict';

import highlighter from '@';
import '../init.scss';
import '../layout.scss';

document.addEventListener('mouseup', function () {
  const range = window.getSelection().getRangeAt(0);
  const h1 = document.createElement('h1');
  range.surroundContents(h1);
});



