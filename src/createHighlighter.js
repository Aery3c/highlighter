'use strict'

import core from '@/core';
import Highlighter from '@/highlighter';
import Applier from '@/applier';

/**
 *
 * @param {string} name
 * @param {Object} [options]
 * @returns {Highlighter}
 */
function createHighlighter (name = 'highlight', options = {}) {
  const applier = new Applier(name, options);
  return new Highlighter(applier, options.containerElement);
}

core.extend({
  createHighlighter
});

export default createHighlighter;
