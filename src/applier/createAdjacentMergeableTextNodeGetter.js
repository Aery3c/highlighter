/**
 * 获取相邻的可合并节点
 */

'use strict'
/**
 *
 * @param {boolean} forward
 * @return {function(node: Node, checkParentElement?: boolean): Node | Text | null}
 */
function factory (forward) {
  const adjacentPropName = forward ? 'nextSibling' : 'previousSibling';
  const position = forward ? 'firstChild' : 'lastChild';
  return function (textNode, checkParentElement) {

    let adjacentNode = textNode[adjacentPropName], parentNode = textNode.parentNode;

    if (adjacentNode && adjacentNode.nodeType === Node.TEXT_NODE) {
      return adjacentNode
    } else if (checkParentElement) {
      adjacentNode = parentNode[adjacentPropName];
      if (adjacentNode && adjacentNode.nodeType === Node.ELEMENT_NODE && isMergeable(adjacentNode, parentNode)) {
        let adjacentNodeChild = adjacentNode[position];
        if (adjacentNodeChild && adjacentNodeChild.nodeType === Node.TEXT_NODE) {
          return adjacentNodeChild;
        }
      }
    }

    return null
  }
}

/**
 *
 * @param {Node | HTMLElement} adjacentNode
 * @param {Node | HTMLElement} node
 * @return {boolean}
 */
function isMergeable(adjacentNode, node) {
  if (adjacentNode.tagName.toUpperCase() !== node.tagName.toUpperCase()) {
    // isEqual tagName
    return false;
  }

  if (adjacentNode.attributes.length !== node.attributes.length) {
    // isEqual attributes.length
    return false;
  }

  for (let attrs = adjacentNode.attributes, i = attrs.length - 1; i >= 0; --i) {
    if (!node.hasAttribute(attrs[i].name)) {
      // isEqual attrName
      return false;
    }

    if (attrs[i].value !== node.getAttribute(attrs[i].name)) {
      // isEqual attrValue
      return false;
    }
  }

  return true;
}

export const getPrecedingMrTextNode = factory(false);

export const getNextMrTextNode = factory(true);

