'use strict';

import highlighter from '@';
import '../init.scss';
import '../layout.scss';

const el = document.querySelector('.section-content').childNodes[1];
const start = el.childNodes[0];
const end = el.childNodes[4];

const range = document.createRange();
range.setStart(start, 2)
range.setEnd(end, 20);
highlighter.splitRangeBoundaries(range);

highlighter.getNodes(range);

window.getSelection().addRange(range);



