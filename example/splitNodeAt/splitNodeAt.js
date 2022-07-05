import { dom } from '@/index';

const range = document.createRange();
range.setStartAndEnd(dom.gBEI('#p').firstChild, 1, dom.gBEI('#p').childNodes[1].firstChild, 3);
const sel = window.getSelection();
sel.removeAllRanges();
sel.addRange(range);

dom.gBEI('#start').addEventListener('click', function() {
  range.splitBoundaries();
  splitNodeAt(dom.getSelfOrAncestorWithClass(range.endContainer, 'highlight'), range.endContainer, range.endOffset);
});

function splitNodeAt () {}