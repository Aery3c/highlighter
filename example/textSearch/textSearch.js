'use strict'

import { Highlighter, dom } from '@';
import debounce from './debounce';

const highlighter = new Highlighter();
const el = dom.gE('#input');
let highlights = [];

el?.addEventListener('input', debounce(function () {
  highlights.forEach(h => highlighter.removeHighlight(h));
  highlighter.highlightAText(el.value)

}, 500));