import { createHighlighter, dom } from '@';

import '../init.scss';
import '../layout.scss';
import './highlighter.scss';

const highlighter = createHighlighter();

dom.gE('#highlight_selection').addEventListener('click', function () {
  highlighter.highlightSelection();
});

dom.gE('#unhighlight_selection').addEventListener('click', function () {
  highlighter.unhighlightSelection();
});

dom.gE('#removeAll_highlight').addEventListener('click', function () {
  highlighter.removeAllHighlight();
});