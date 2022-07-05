import core from '@/index';

const { gBEI } = core.dom;

const testEl1 = gBEI('#h4');

// range具有相同边界点，且元素是textNode
const range1 = document.createRange();
range1.selectNodeContents(testEl1.firstChild);
const rit1 = new core.RangeIterator(range1, NodeFilter.SHOW_ALL);


// range具有相同边界点，且元素是elementNode
const range2 = document.createRange();
range2.selectNodeContents(testEl1);
const rit2 = new core.RangeIterator(range2, NodeFilter.SHOW_ALL);


// range 具有不同边界点，且元素为textNode
const range3 = document.createRange();
range3.setStartAndEnd(testEl1.firstChild, 5, gBEI('#p1').firstChild, 5);
const rit3 = new core.RangeIterator(range3, NodeFilter.SHOW_ALL);


// range 具有不同边界点，start = elementNode, end = textNode;
const range4 = document.createRange();
range4.setStartAndEnd(document.body, 0, gBEI('#p4-h4'), 3);

const rit4 = new core.RangeIterator(range4, NodeFilter.SHOW_ELEMENT);

window.getSelection().addRange(range4);

let node, g = rit4.generator();
while ((node = g.next().value)) {
  console.log(node);
}



