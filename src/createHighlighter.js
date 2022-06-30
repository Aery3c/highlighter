'use strict'

import core from '@/core';
import Highlighter from '@/highlighter';

/**
 *
 * @param {string} name
 * @param {Object} [options]
 * @returns {Highlighter}
 */
function createHighlighter (name = 'highlight', options = {}) {
  return new Highlighter(name, options);
}

core.extend({
  createHighlighter
});

export default createHighlighter;
