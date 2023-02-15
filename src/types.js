// @flow
'use strict'

export type RefillsOptions = {|
  tagName?: string;
  className?: string;
  elAttrs?: Object;
  elProps?: Object;
|}

export type DefaultRefillsOptions = {|
  tagName: string;
  className: string;
  elAttrs: Object;
  elProps: Object;
|}

export type UseSelOptions = {|
  selection?: Selection;
  referenceNodeId?: string;
|}

export type Obj = { [key: string]: any };