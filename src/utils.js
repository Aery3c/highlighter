'use strict'

/**
 *
 * @param [options] - options
 * @param [defaults] - defaults
 * @return {{}}
 */
export function createOptions(options, defaults) {
  let params = {};
  if (typeof params === 'object') {
    Object.assign(params, options);
  }
  if (typeof defaults === 'object') {
    Object.assign(params, defaults);
  }

  return params;
}