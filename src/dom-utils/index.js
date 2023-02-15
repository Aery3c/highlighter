// @flow

import * as crudNode from './crudNode';
import * as classes from './classes';
import * as findClosestAncestor from './findClosestAncestor';
import { isCharacterDataNode } from './isCharacterDataNode';
import { getNodeIndex } from './getNodeIndex';
import { getNodeLength } from './getNodeLength';

export default {
  ...crudNode,
  ...classes,
  ...findClosestAncestor,
  isCharacterDataNode,
  getNodeIndex,
  getNodeLength,
  getSelection
};