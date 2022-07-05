'use strict'

import core from '@/core';
import Applier from '@/applier';

/** @typedef {{ className: string; tagName: string; elAttrs: {}; elProps: {} }} ApplierOptions */

/**
 *
 * @param {ApplierOptions} options
 * @return {Applier}
 */
function createApplier (options) {
  return new Applier(options);
}

core.extend({
  createApplier
});

export default createApplier;