import { dom } from '@/index';

const { gBEI } = dom;

const testEl = gBEI('#p');

const ids = [
  ['#addClass', addClass],
  ['#removeClass', removeClass],
  ['#toggleClass', toggleClass]
];

function addClass () {
  dom.addClass(testEl, 'Class1 Class2');
}

function removeClass () {
  dom.removeClass(testEl, 'Class1');
}

function toggleClass () {
  dom.toggleClass(testEl, 'Class1');
}

ids.forEach(([id, listener]) => {
  gBEI(id).addEventListener('click', listener);
});