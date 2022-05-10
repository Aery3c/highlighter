'use strict'

import core from '@/core';
import Applier from '@/applier';

/**
 *
 * @param {string} [className]
 * @param {Object} [options]
 * @returns {Applier}
 */
function createApplier (className = 'highlight', options = {}) {
  return new Applier(className, options);
}

core.extend({
  createApplier
});

export default createApplier;