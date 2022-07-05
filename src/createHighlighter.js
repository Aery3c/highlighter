'use strict'

import core from '@/core';
import Highlighter from '@/highlighter';

/**
 *
 * @param {string} [name]
 * @param {Object} [options]
 * @returns {Highlighter}
 */
function createHighlighter (name, options) {
  const defaultOptions = core.utils.getDefaultOptions();

  if (core.utils.toType(name) !== 'string') {
    name = core.DEFAULT_CLASS_NAME;
  }

  if (core.utils.toType(options) !== 'object') {
    options = {};
  }

  return new Highlighter(name, {
    ...defaultOptions,
    ...options,
  });
}

core.extend({
  createHighlighter
});

export default createHighlighter;
