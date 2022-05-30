import { dom, createHighlighter } from '@/index';

const highlighter = createHighlighter();

dom.gBEI('#highlightSelection').addEventListener('click', function () {
  const highlights = highlighter.highlightSelection();
  console.log(highlights)
});

dom.gBEI('#unhighlightSelection').addEventListener('click', function () {
  const highlights = highlighter.unhighlightSelection();
  console.log(highlights)
});

