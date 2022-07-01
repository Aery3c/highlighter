'use strict'

import core from '@/core';

/**
 * applies to then range
 * @param {Range} range
 * @param {string} tagName
 * @param {string} className
 * @param {Object} [elAttrs]
 * @param {Object} [elProps]
 */
function appliesToRange (range, tagName, className, elAttrs = {}, elProps = {}) {

  // get current characterRange
  const characterRange = range.toCharacterRange();

  // split
  range.splitBoundaries();

  // get textNodes in range
  const textNodes = core.utils.getEffectiveTextNodes(range);

  if (textNodes.length) {
    textNodes.forEach(textNode => {
      if (!core.dom.getSelfOrAncestorWithClass(textNode, className) && !core.dom.isWhiteSpaceTextNode(textNode)) {
        core.utils.appliesToText(textNode, tagName, className, elAttrs, elProps);
      }
    });

    const lastTextNode = textNodes[textNodes.length - 1];
    range.setStartAndEnd(textNodes[0], 0, lastTextNode, lastTextNode.length);

    core.dom.normalize(textNodes, range, false, function (adjacentNode) {
      return isMergeable(adjacentNode, tagName, className, elAttrs, elProps);
    });
  }

  range.moveToCharacterRange(characterRange);
}

function isMergeable (adjacentNode, tagName, className, elAttrs, elProps) {
  let identifier = true;

  if (core.dom.getClass(adjacentNode) !== className) {
    identifier = false;
  } else if (adjacentNode.tagName.toLowerCase() !== tagName.toLowerCase()) {
    identifier = false;
  }else {
    core.each(elProps, function (key, value) {
      if (adjacentNode[key] !== value) {
        identifier = false;
      }
    });

    core.each(elAttrs, function (key, value) {
      if (adjacentNode.getAttribute(key) !== value) {
        identifier = false;
      }
    });
  }

  return identifier;
}

export default appliesToRange;
