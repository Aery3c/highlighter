import { dom } from '@/index';

const { gBEI, addClass, removeClass } = dom;

const testEl = gBEI('#p');

gBEI('#addClass').addEventListener('click', function () {
  addClass(testEl, 'addClass1 addClass2');
});

gBEI('#removeClass').addEventListener('click', function () {
  // removeClass(testEl); // remove class attr
  // removeClass(testEl, 'addClass1'); // remove part
  // removeClass(testEl, 'a addClass1'); // remove nonexistent and part
});