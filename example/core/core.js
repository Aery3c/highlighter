'use strict'

import core, { utils, dom } from '@';
import '../init.scss';
import '../layout.scss';
import './core.scss';

document.querySelector('#insertNodeToRange').addEventListener('click', function () {
  const range = window.getSelection().getRangeAt(0);

  const span = document.createTextNode('insert_text');
  core.insertNodeToRange(span, range);

  utils.appliesToRange(range, 'span', 'highlight');
});


document.querySelector('#collapse').addEventListener('click', function () {
  const range = window.getSelection().getRangeAt(0);

  const span = document.createTextNode('insert_text');
  core.collapse(range, false);
  core.insertNodeToRange(span, range);

});

document.querySelector('#comparePoints').addEventListener('click', function () {
  const code1 = document.querySelector('#code').firstChild;
  const code2 = document.querySelector('#code2').firstChild;

  console.log(core.comparePoints(code1.parentNode, dom.getNodeIndex(code1), code2.parentNode, dom.getNodeIndex(code2)));
});

document.querySelector('#compareBoundaryPoints').addEventListener('click', function () {
  const target = document.createRange();
  const source = document.createRange();

  const title = document.querySelector('#title');

  target.setStart(title.firstChild, 2);
  target.setEnd(title.firstChild, 4);

  source.setStart(title.firstChild, 3);
  source.setEnd(title.firstChild, 5);


  console.log(core.compareBoundaryPoints(3, target, source));
  console.log(target.compareBoundaryPoints(3, source));
});

document.querySelector('#comparePoint').addEventListener('click', function () {
  const title = document.querySelector('#title');

  const range = document.createRange();
  range.setStart(title.firstChild, 0);
  range.setEnd(title.firstChild, title.firstChild.length);

  console.log(range);
  console.log(range.comparePoint(title.previousSibling, 0));
});
