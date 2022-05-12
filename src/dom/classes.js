'use strict'

const rnothtmlwhite = /[^\x20\t\r\n\f]+/g;
const classListSupport = !(typeof document.createElement('span').classList !== 'undefined');
const classNameSupport = !(typeof document.createElement('span').className !== 'undefined');

/**
 *
 * @param {string|Array} value
 * @return {string[]}
 */
function classesToArray (value) {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === 'string') {
    return value.match(rnothtmlwhite) || [];
  }
  return [];
}

/**
 *
 * @param {string} value
 * @returns {string}
 */
function stripAndCollapse( value ) {
  const tokens = value.match(rnothtmlwhite) || [];
  return tokens.join(' ');
}

/**
 *
 * @param {HTMLElement} el
 * @param {string} value
 */
export function toggleClass (el, value) {
  const classNames = classesToArray(value);

  if (classNames.length) {
    classNames.forEach(className => {
      if (classListSupport) {
        el.classList.toggle(className);
      } else {
        if (hasClass(el, className)) {
          removeClass(el, className);
        } else {
          addClass(el, className);
        }
      }
    });

    return true;
  }

  return false;
}

/**
 *
 * @param {HTMLElement} el
 * @return {string}
 */
export function getClass (el) {
  if (classNameSupport) {
    return el.className;
  }

  return el.getAttribute('class') || '';
}

/**
 *
 * @param {HTMLElement} el
 * @param {string} value
 * @return {boolean}
 */
export function hasClass (el, value) {
  if (classListSupport) {
    return el.classList.contains(value);
  }
  const classNames = classesToArray(getClass(el));
  return classNames.indexOf(value) > -1;
}

/**
 *
 * @param {HTMLElement} el
 * @param {string} value
 */
export function addClass (el, value) {

  let classNames = classesToArray(value);

  if (classNames.length) {
    if (classListSupport) {
      el.classList.add(...classNames);
    } else {

    }
  }
}

/**
 *
 * @param {HTMLElement} el
 * @param {string} value
 */
export function removeClass (el, value) {
  el.classList.remove(value);
}
