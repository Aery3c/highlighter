'use strict'

import { createHighlighter, utils, createCharacterRange } from '@/index';
import './nav.scss';
import { getScrollTop, debounce } from '../utils';

const containerElement = document.querySelector('.book_container');

// set reader progress
const progressEl = document.querySelector('.book_nav_progress > div');
window.addEventListener('scroll', () => {
  const totalH = document.body.scrollHeight || document.documentElement.scrollHeight
  const clientH = window.innerHeight || document.documentElement.clientHeight
  const scrollH = getScrollTop();
  const validH = totalH - clientH
  const result = (scrollH / validH * 100).toFixed(2) - 100;
  progressEl.style.transform = `translateX(${result}%)`;
});

// input bind keyboard
const inputEl = document.querySelector('.book_nav_find_wrapper > input');

inputEl.addEventListener('keyup', debounce(() => {
  findText(inputEl.value);
}, 500));

const highlighterYellow = createHighlighter('yellow', {
  containerElement
});

let highlights = []
/**
 * 搜索并高亮
 * @param {string} text
 */
function findText (text) {
  highlighterYellow.removeHighlights(highlights);
  highlights = highlighterYellow.highlightAllText(text, true);
}