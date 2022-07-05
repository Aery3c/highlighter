'use strict'

import { createHighlighter } from '@/index';

export const highlighterPink = createHighlighter('pink', {
  containerElement: document.querySelector('.book_container')
});

