'use strict'

import { isCharacterDataNode, getNodeIndex, getNodeLength } from '@/dom';

const core = {};

/**
 *
 * @param {Range} range
 */
function splitRangeBoundaries (range) {
  let [sc, so, ec, eo] = [range.startContainer, range.startOffset, range.endContainer, range.endOffset];

  const startSameEnd = (sc === ec);
  if (isCharacterDataNode(ec) && eo > 0 && eo < ec.length) {
    ec.splitText(eo);
  }

  if (isCharacterDataNode(sc) && so > 0 && so < sc.length) {
    sc = sc.splitText(so);
    if (startSameEnd) {
      eo -= so;
      ec = sc;
    } else if (ec === sc.parentNode && eo < getNodeIndex(ec)) {
      eo++;
    }
    so = 0;
  }

  setRange(range, sc, so, ec, eo);
}

function setRange (range) {
  let sc = arguments[1], so = arguments[2], ec, eo;
  const len = getNodeLength(sc);

  switch (arguments.length) {
    case 3:
      ec = sc;
      eo = len;
      break;
    case 4:
      ec = sc;
      eo = so;
      break;
    case 5:
      ec = arguments[3];
      eo = arguments[4];
      break;
  }

  range.setStart(sc, so);
  range.setEnd(ec, eo);
}

core.splitRangeBoundaries = splitRangeBoundaries;

export default core;
