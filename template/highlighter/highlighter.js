import { dom, createHighlighter } from '@/index';

const highlighter = createHighlighter('pink');
const highlighter2 = createHighlighter('yellow');

dom.gE('#pink').addEventListener('click', function () {
  highlighter.highlightSelection();
});

dom.gE('#unPink').addEventListener('click', function () {
  highlighter.unhighlightSelection();
});

dom.gE('#yellow').addEventListener('click', function () {
  highlighter2.highlightSelection();
});
