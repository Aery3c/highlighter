// @flow
import { Highlighter } from '../../src';

const highlighter = new Highlighter();

//
// const highlighter = new Highlighter({ className: 'yellow', normalize: false });
//
// const toggleColorEl = document.getElementById('toggleColor');
const useSelectionEl = document.getElementById('useSelection');
// const unSelectionEl = document.getElementById('unSelection');
//
// toggleColorEl?.addEventListener('click', function () {
//   if (highlighter.options.className === 'yellow') {
//     highlighter.setOptions({ className: 'blue' })
//   } else {
//     highlighter.setOptions({ className: 'yellow' });
//   }
// });
//
useSelectionEl?.addEventListener('click', function () {
  highlighter.useSelection();
  console.log(highlighter.highlights);
});
//
// unSelectionEl?.addEventListener('click', function () {
//   highlighter.unSelection();
//   console.log(highlighter.highlights);
// });
//
// highlighter.on('click', function (h) {
//   if(window.confirm('remove?')) {
//     highlighter.removeHighlight(h);
//     console.log(highlighter.highlights);
//   }
// })
//
// highlighter.deserialize([{ start: 50, end: 55, className: 'yellow' }, { start: 53, end: 59, className: 'orange' }, { start: 100, end: 105, className: 'orange' }, { start: 190, end: 205, className: 'blue' }]);
//
//
