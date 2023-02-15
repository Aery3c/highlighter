// @flow

'use strict'
import type { RefillsOptions, DefaultRefillsOptions } from '../types';

import { each } from './each';
export function createRefillsOptions (options?: RefillsOptions = {}): DefaultRefillsOptions {
  const defaultOptions = {
    tagName: 'span',
    className: 'highlight',
    elAttrs: {},
    elProps: {},
    normalize: true
  }

  each(options, (propName, propValue) => {
    // eslint-disable-next-line no-prototype-builtins
    if (options.hasOwnProperty(propName)) {
      defaultOptions[propName] = propValue;
    }
  });

  return defaultOptions;
}

