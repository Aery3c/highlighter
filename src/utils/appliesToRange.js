'use strict'

import core from '@/core';

/**
 * applies to then range
 * @param {Range} range
 * @param {Object} [options]
 */
function appliesToRange (range, options = {}) {
  const tagName = options.tagName || core.TAG_NAME,
    className = options.className || core.DEFAULT_CLASS_NAME,
    elAttrs = options.elAttrs,
    elProps = options.elProps,
    containerElement = options.containerElement;

  // get current characterRange
  const characterRange = range.toCharacterRange(containerElement);

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

  range.moveToCharacterRange(characterRange, containerElement);
}

export default appliesToRange;