// @flow
'use strict'

import { isCharacterDataNode } from '../dom-utils/isCharacterDataNode';
import { getNodeIndex } from '../dom-utils/getNodeIndex';

export function splitRangeBoundaries (range: Range): void {
  let [sc, so, ec, eo] = [range.startContainer, range.startOffset, range.endContainer, range.endOffset];
  const startSameEnd: boolean = (sc === ec);
  // $FlowIgnore
  if (isCharacterDataNode(ec) && eo > 0 && eo < ec.length) {
    // $FlowIgnore
    ec.splitText(eo);
  }
  // $FlowIgnore
  if (isCharacterDataNode(sc) && so > 0 && so < sc.length) {
    // $FlowIgnore
    sc = sc.splitText(so);
    if (startSameEnd) {
      eo -= so;
      ec = sc;
    } else if (ec === sc.parentNode && eo <= getNodeIndex(sc)) {
      eo++;
    }
    so = 0;
  }
}