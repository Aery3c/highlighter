'use strict'

import core from '@/core';
import Highlighter from '@/highlighter';

const DEFAULT_OPTIONS = core.utils.getDefaultOptions();

/**
 *
 * @param {string} [name]
 * @param {Object} [options]
 * @returns {Highlighter}
 */
function createHighlighter (name, options) {
  if (core.utils.toType(name) !== 'string') {
    name = core.DEFAULT_CLASS_NAME;
  }

  if (core.utils.toType(options) !== 'object') {
    options = {};
  }

  return new Highlighter(name, {
    ...DEFAULT_OPTIONS,
    ...options,
  });
}

core.extend({
  createHighlighter
});

export default createHighlighter;
