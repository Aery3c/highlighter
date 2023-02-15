/**
 * when two Character ranges have different reference nodes.
 *
 */

// @flow
'use strict'

import { CharacterRange } from '../../src';

const p = document.getElementById('p');
const span = document.getElementById('span');
const start = 0, end = 9;
const body = document.body;
if (p && span && body) {
  const c1 = new CharacterRange(start, end, p);
  const c2 = new CharacterRange(start, end, span);

  console.log(CharacterRange.fromRange(c1.toRange(), body));
  console.log(CharacterRange.fromRange(c2.toRange(), body));
}
