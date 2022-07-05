import { dom, createHighlighter } from '@/index';

const highlighter = createHighlighter('pink');

dom.gE('#pink').addEventListener('click', () => {
  highlighter.highlightSelection();
});

dom.gE('#unPink').addEventListener('click', () => {
  highlighter.unhighlightSelection();
});