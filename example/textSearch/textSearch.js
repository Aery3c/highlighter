/**
 * A text search demo simulates browser command + f
 */

'use strict'

import { Refills, dom } from '@';
import TextSearch from '@/highlighter/textSearch';
import CharacterRange from '@/highlighter/characterRange';
import debounce from './debounce';

const textSearch = new TextSearch(), yellow = new Refills(), orange = new Refills({ className: 'orange' });

/**
 *
 * @param {string} text
 * @param {Node} referenceNode
 */
function getCharacterRanges (text, referenceNode) {
  textSearch.setup(text);
  return textSearch.find(referenceNode.textContent).filter(pos => pos.string === text).map(pos => {
    return new CharacterRange(pos.start, pos.end, referenceNode);
  });
}

function* characterMarker (text, referenceNode) {
  let count = 0, results = getCharacterRanges(text, referenceNode);
  while (results.length) {
    yield results[count++];
    if (count === results.length) {
      count = 0;
    }
  }
}

const el = dom.gE('#input'), container = document.body;
let gen, ranges = [], c = null;

el.addEventListener('input', debounce(function (e) {
  let r;
  while ((r = ranges.pop())) {
    yellow.wipeToRange(r.toRange());
  }

  if (c) {
    orange.wipeToRange(c.toRange());
    c = null;
  }

  const value = e.target.value;
  if (value) {
    gen = characterMarker(value, container);
    const s = getCharacterRanges(value, container);
    s.forEach(cr => {
      yellow.appliesToRange(cr.toRange());
      ranges.push(cr);
    });
  }

}, 200));

el.addEventListener('keyup', debounce(function (e) {
  if (e.keyCode === 13) {
    if (c) {
      orange.wipeToRange(c.toRange());
    }

    const value = e.target.value;
    if (value) {
      c = gen.next().value;
      orange.appliesToRange(c.toRange());
    }
  }
}, 100));
