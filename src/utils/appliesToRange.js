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
function appliesToRange (range, tagName = core.TAG_NAME, className = core.className, elAttrs = {}, elProps = {}) {

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

    core.dom.normalize(textNodes, range, false);
  }

  range.moveToCharacterRange(characterRange);
}

export default appliesToRange;