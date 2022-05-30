import { dom, createHighlighter } from '@/index';

const highlighter = createHighlighter();

dom.gBEI('#highlightSelection').addEventListener('click', function () {
  const highlights = highlighter.highlightSelection();
  console.clear();
  highlights.forEach(ht => {
    ht.inspect();
  })
});

dom.gBEI('#unhighlightSelection').addEventListener('click', function () {
  const highlights = highlighter.unhighlightSelection();
  console.clear();
  highlights.forEach(ht => {
    ht.inspect();
  })
});

