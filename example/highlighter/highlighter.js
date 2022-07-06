import Highlighter, { dom, createHighlighter } from '@/index';

const highlighter = createHighlighter('pink');

highlighter.on(Highlighter.event.CLICK, function (highlight) {
  highlighter.removeHighlight(highlight);
});

highlighter.on(Highlighter.event.CREATE, function (highlights) {
  console.log(highlights);
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