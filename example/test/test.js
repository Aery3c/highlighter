'use strict';

import highlighter from '@';
import {createContainerRange, createDiffPointTextNodeRange, createSamePointTextNodeRange} from '@test/range-getter';
import { createTextNode, createElNode } from '@test/node-getter';

const range = createContainerRange();
// range.setStart(range.startContainer, 3);
// range.setEnd(range.endContainer, 6);

range.surroundContents(createElNode());

window.getSelection().addRange(range);