// @flow
import TextSearch from './TextSearch';
import { CharacterRange, Refills } from '../../src';
import Highlight from '../../src/utils/highlight';

const textSearch = new TextSearch(),
  refillsYellow = new Refills({ className: 'yellow' }),
  refillsOrange = new Refills({ className: 'orange' });

function getCharacterRanges (text: string, referenceNode: Element): CharacterRange[] {
  textSearch.setup(text);
  return textSearch.find(referenceNode.textContent).filter(pos => pos.string === text).map(pos => {
    return new CharacterRange(pos.start, pos.end, referenceNode);
  });
}

function* generator (text: string, referenceNode: Element) {
  let count = 0, results = getCharacterRanges(text, referenceNode);
  while (results.length) {
    yield results[count++];
    if (count === results.length) {
      count = 0;
    }
  }
}

let characterRangeStore, highlights = [], next = null;
const el = document.querySelector('#search'),
  referenceNode = document.body;

el.addEventListener('input', debounce(function (e) {
  let highlight;
  while ((highlight = highlights.pop())) {
    highlight.off();
  }

  if (next) {
    next.off();
    next = null;
  }

  const value = e.target.value;
  if (value) {
    characterRangeStore = generator(value, referenceNode);
    const results = getCharacterRanges(value, referenceNode);
    results.forEach((cr, indxex) => {
      highlight = new Highlight(cr, refillsYellow);
      highlights.push(highlight);
      highlight.on();
      if (indxex === 0) {
        highlight.scrollIntoView({ scrollMode: 'if-needed', block: 'center' });
      }
    });
  }

}, 200));

el.addEventListener('keyup', debounce(function (e) {
  if (e.keyCode === 13) {
    if (next) {
      next.off();
    }

    const value = e.target.value;
    if (value) {
      next = new Highlight(characterRangeStore.next().value, refillsOrange);
      next.on();
      next.scrollIntoView({ scrollMode: 'if-needed', block: 'center' })
    }
  }
}, 100));

function debounce (func: Function, wait?: number = 100) {
  let timestamp, args, timeout, context;
  function later () {
    const last = Date.now() - timestamp;
    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      func.apply(context, args);
      context = args = null;
    }

  }
  // $FlowIgnore
  return function () {
    context = this;
    args = arguments;
    timestamp = Date.now();
    if (!timeout) {
      timeout = setTimeout(later, wait);
    }
  }
}
