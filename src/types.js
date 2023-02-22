// @flow
'use strict'

export type RefillsOptions = {|
  tagName?: string;
  className?: string;
  elAttrs?: Object;
  elProps?: Object;
  normalize?: boolean;
|}

export type DefaultRefillsOptions = {|
  tagName: string;
  className: string;
  elAttrs: Object;
  elProps: Object;
  normalize: boolean;
|}

export type UseSelOptions = {|
  selection?: Selection;
  referenceNodeId?: string;
|}

export type Serialize = {|
  start: number;
  end: number;
  className?: string;
  referenceNodeId?: string;
  text?: string;
|}

export type Obj = { [key: string]: any };