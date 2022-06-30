'use strict'

import core from '@/core';

/**
 *
 * @param {string} tagName
 * @param {string} className
 * @param {Object} elAttrs
 * @param {Object} elProps
 * @return {HTMLElement}
 */
function createContainer (tagName, className, elAttrs = {}, elProps = {}) {
  const el = document.createElement(tagName);
  core.dom.addClass(el, className);
  mapAttrsToElement(elAttrs, el);
  mapPropsToElement(elProps, el);
  return el;
}

/**
 *
 * @param {Object} attrs
 * @param {HTMLElement | Node} el
 */
function mapAttrsToElement (attrs, el) {
  core.each(attrs, function (attrName, attrValue) {
    if (Object.hasOwn(attrs, attrName) && !/^class(?:Name)?$/i.test(attrName)) {
      el.setAttribute(attrName, attrValue);
    }
  });
}

/**
 *
 * @param {Object} props
 * @param {HTMLElement | Node} el
 */
function mapPropsToElement (props, el) {
  core.each(props, function (propName, propValue) {
    if (Object.hasOwn(props, propName)) {
      if (propName === 'className') {
        core.dom.addClass(el, propValue);
      } else {
        el[propName] = propValue;
      }
    }
  });
}

export default createContainer;