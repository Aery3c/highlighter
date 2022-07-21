import Highlighter from '@';
import { gE, getNodeIndex } from '@/dom';

const start = gE('#b').firstChild;
const end = gE('#b');

const range = document.createRange();

range.setStart(start, 4);
range.setEnd(end, 1);

console.log(range.endOffset);
console.log(getNodeIndex(range.startContainer));

Highlighter.splitRangeBoundaries(range);

window.getSelection().addRange(range);
