import { dom, createHighlighter } from '@/index';

const highlighter = createHighlighter('pink');

highlighter.on('click', function (highlight) {
  highlighter.removeHighlight(highlight);
});

dom.gE('#pink').addEventListener('click', () => {
  highlighter.highlightSelection();
});

dom.gE('#unPink').addEventListener('click', () => {
  highlighter.unhighlightSelection();
});

dom.gE('#outputRanges').addEventListener('click', () => {
  const sel = window.getSelection();
  for (let i = 0; i < sel.rangeCount; ++i) {
    console.log(sel.getRangeAt(i));
  }
});