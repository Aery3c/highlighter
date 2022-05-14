'use strict'

import rnothtmlwhite from '@/utils/rnothtmlwhite';
import core from '@/core';
import stripAndCollapse from "@/utils/stripAndCollapse";

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
 * @param {HTMLElement} el
 * @param {string} value
 */
export function toggleClass (el, value) {
  const classNames = classesToArray(value);

  if (classNames.length && el.nodeType === Node.ELEMENT_NODE) {
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

  if (el.nodeType !== Node.ELEMENT_NODE) {
    return '';
  }

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

  if (el.nodeType !== Node.ELEMENT_NODE) {
    return false;
  }

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

  let classNames = classesToArray(value), curClass, cur, final;

  if (classNames.length && el.nodeType === Node.ELEMENT_NODE) {
    if (classListSupport) {
      el.classList.add(...classNames);
    } else {
      curClass = getClass(el);
      cur = ' ' + core.utils.stripAndCollapse(curClass) + ' ';
      classNames.forEach(className => {
        if (cur.indexOf(' ' + className + ' ') < 0) {
          cur += className + ' '
        }
      });

      final = core.utils.stripAndCollapse(cur);

      if (curClass !== final) {
        if (classNameSupport) {
          el.className = final;
        } else {
          el.setAttribute('class', final);
        }
      }
    }
  }
}

/**
 *
 * @param {HTMLElement} el
 * @param {string} [value]
 */
export function removeClass (el, value) {

  let classNames = classesToArray(value), curClass, cur, final,
    isElement = (el.nodeType === Node.ELEMENT_NODE);

  if (arguments.length < 2 && isElement) {
    return el.removeAttribute('class');
  }

  if (classNames.length && isElement) {
    if (classListSupport) {
      el.classList.remove(...classNames);
    } else {
      curClass = getClass(el);
      cur = ' ' + stripAndCollapse(curClass) + ' ';
      classNames.forEach(className => {
        while (cur.indexOf(' ' + className + ' ') > -1) {
          cur = cur.replace(' ' + className + ' ', ' ');
        }
      });

      final = core.utils.stripAndCollapse(cur);
      if (curClass !== final) {
        if (classNameSupport) {
          el.className = final;
        } else {
          el.setAttribute('class', final);
        }
      }
    }
  }
}
