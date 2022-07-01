'use strict'

import core from '@/core';

/**
 *
 * @param options
 * @return {{elAttrs: {}, elProps: {}, className: string, tagName: string, containerElement: HTMLElement}}
 */
function createHighlightOptions (options) {
  const newOptions = {
    tagName: core.TAG_NAME,
    className: core.DEFAULT_CLASS_NAME,
    containerElement: core.CONTEXT,
    elAttrs: {},
    elProps: {}
  };

  if (core.utils.toType(options) !== 'object') {
    options = {};
  }

  core.each(options, function (key, value) {
    if (key === 'tagName' && core.utils.toType(value) === 'string') {
      newOptions['tagName'] = value;
    }

    if (key === 'className' && core.utils.toType(value) === 'string') {
      newOptions['className'] = value;
    }

    if (key === 'containerElement' && value instanceof HTMLElement) {
      newOptions['containerElement'] = value;
    }

    if (['elAttrs', 'elProps'].indexOf(key) !== -1 && core.utils.toType(value) === 'object') {
      newOptions[key] = value;
    }

  });

  return newOptions;
}

export default createHighlightOptions;
