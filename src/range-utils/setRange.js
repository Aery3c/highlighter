// @flow
'use strict'
import { getNodeLength } from '../dom-utils/getNodeLength';

export function setRange (range: Range, ...args: Array<any>) {
  let sc = args[0], so = args[1], ec, eo;
  const len = getNodeLength(sc);

  switch (args.length) {
    case 2:
      ec = sc;
      eo = len;
      break;
    case 3:
      ec = args[2];
      eo = so;
      break;
    case 4:
      ec = args[2];
      eo = args[3];
      break;
  }

  range.setStart(sc, so);
  // $FlowIgnore
  range.setEnd(ec, eo);
}
