'use strict'

import core from '@/core';

/**
 * applies to then textNode
 * @param {Text} textNode
 * @param {string} tagName
 * @param {string} className
 * @param {Object} elAttrs
 * @param {Object} elProps
 */
function appliesToText (textNode, tagName, className, elAttrs = {}, elProps = {}) {
  const parentNode = textNode.parentNode;
  if (textNode.nodeType === Node.TEXT_NODE) {
    if (parentNode.childNodes.length === 1
      && parentNode.nodeName.toLowerCase() === tagName
      && elementHasProps(parentNode, elProps)
      && elementHasAttrs(parentNode, elAttrs)
    ) {
      core.dom.addClass(parentNode, className);
    } else {
      const el = core.utils.createContainer(tagName, className, elAttrs, elProps);
      parentNode.insertBefore(el, textNode);
      el.appendChild(textNode);
    }
  }
}

/**
 *
 * @param {HTMLElement | Node} el
 * @param {Object} props
 * @return {boolean}
 */
function elementHasProps (el, props) {
  return each(props, function (p, propValue) {
    if (p === 'className') {
      return hasAllClass(el, propValue);
    } else if (core.utils.toType(propValue) === 'object') {
      return elementHasProps(el, propValue);
    } else if (el[p] !== propValue) {
      return false;
    }
  });
}

/**
 *
 * @param {HTMLElement | Node} el
 * @param {Object} attrs
 * @return {boolean}
 */
function elementHasAttrs (el, attrs) {
  return each(attrs, function (p, propValue) {
    if (el.getAttribute(p) !== propValue) {
      return false;
    }
  });
}

function hasAllClass (el, className) {
  const classNames = core.dom.classesToArray(className);
  let i = 0, len = classNames.length;
  for (i; i < len; ++i) {
    if (!core.dom.hasClass(el, classNames[i])) {
      return false;
    }
  }

  return true;
}

function each (obj, callback) {
  let flag = true;
  core.each(obj, function (p, propValue) {
    if (callback(p, propValue) === false) {
      flag = false;
      return flag;
    }
  });

  return flag;
}

export default appliesToText;