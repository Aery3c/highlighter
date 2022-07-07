import { createHighlighter, dom, utils, createCharacterRange } from '@';

import '../init.scss';
import '../layout.scss';
import './findText.scss';

const highlighter = createHighlighter();
const input = dom.gE('#input');

dom.gE('#search').addEventListener('click', function () {
  let text, fullText, matchs;
  if ((text = utils.stripAndCollapse(input.value))) {
    fullText = document.body.textContent;
    matchs = [...fullText.matchAll(new RegExp(`${text}`, 'gi'))];
    matchs.forEach(function (match) {
      const { index } = match;
      const characterRange = createCharacterRange(index, index + text.length);
      console.log(characterRange);
    });
  }

});
