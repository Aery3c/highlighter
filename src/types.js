// @flow
/* eslint-disable no-undef */
'use strict'

export type Obj = { [key: string]: any };

export type RefillsOptions = {|
  tagName?: string;
  className?: string;
  elAttrs?: Object;
  elProps?: Object;
  normalize?: boolean;
|}

// eslint-disable-next-line no-undef
// $FlowIgnore
export type DefaultRefillsOptions = Required<RefillsOptions>;

export type UseSelOptions = {|
  selection?: Selection;
  referenceNodeId?: string;
|}

export type UseRangeOptions = {|
  ...UseSelOptions
|}

export type Serialize = {|
  start: number;
  end: number;
  highlightId: number;
  className?: string;
  referenceNodeId?: string;
  text?: string;
|}

export type HighlighterOptions = {|
  ...RefillsOptions
|};

// $FlowIgnore
export type DefaultHighlighterOptions = Required<HighlighterOptions>;