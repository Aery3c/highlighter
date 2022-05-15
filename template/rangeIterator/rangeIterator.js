import core from '@/index';

const { gBEI } = core.dom;

const testEl1 = gBEI('#h4');

// range具有相同边界点，且元素是textNode
const range1 = document.createRange();
range1.selectNodeContents(testEl1.firstChild);
const rit1 = new core.RangeIterator(range1, NodeFilter.SHOW_ALL);
console.log(rit1);

// range具有相同边界点，且元素是elementNode
const range2 = document.createRange();
range2.selectNodeContents(testEl1);
const rit2 = new core.RangeIterator(range2, NodeFilter.SHOW_ALL);
console.log(rit2);

// range 具有不同边界点，且元素为textNode
const range3 = document.createRange();
range3.setStartAndEnd(testEl1.firstChild, 5, gBEI('#p1').firstChild, 5);
const rit3 = new core.RangeIterator(range3, NodeFilter.SHOW_ALL);
console.log(rit3);

// range 具有不同边界点，start = elementNode, end = textNode;
const range4 = document.createRange();
range4.setStartAndEnd(gBEI('#_2rhmJa'), 0, gBEI('#p4-h4').firstChild, 5);
const rit4 = new core.RangeIterator(range4, NodeFilter.SHOW_ALL);
console.log(rit4);
window.getSelection().addRange(range4);

const nit = document.createNodeIterator(rit4.range.commonAncestorContainer);
let node;
while ((node = nit.nextNode())) {
  console.log(node);
}
console.log(node);



