'use strict'

export function getScrollTop () {
  return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
}

/**
 * debounce for input
 * @param callback
 * @param delay
 * @return {(function(): void)|*}
 */
export function debounce (callback, delay = 1000) {
  let timer = null;
  return function () {
    let self = this;
    let args = arguments;
    timer && clearTimeout(timer)
    timer = setTimeout(function () {
      callback.apply(self, args)
    }, delay);
  }
}