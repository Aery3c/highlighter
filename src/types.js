// @flow
'use strict'

export type RefillsOptions = {|
  tagName?: string;
  className?: string;
  elAttrs?: Obj;
  elProps?: Obj;
|}

export type DefaultRefillsOptions = {|
  tagName: string;
  className: string;
  elAttrs: Obj;
  elProps: Obj;
|}

export type HighlighterOptions = {|
  ...RefillsOptions,
|}

export type UseSelOptions = {|
  selection?: Selection;
  referenceNodeId?: string;
|}

export type Obj = { [key: string]: any };