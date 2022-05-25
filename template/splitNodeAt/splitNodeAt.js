import { dom, utils } from '@/index';

const range = document.createRange();
range.setStartAndEnd(dom.gBEI('#p').firstChild, 1, dom.gBEI('#p').childNodes[1].firstChild, 3);
const sel = window.getSelection();
sel.removeAllRanges();
sel.addRange(range);

dom.gBEI('#start').addEventListener('click', function() {
  range.splitBoundaries();
  splitNodeAt(dom.getSelfOrAncestorWithClass(range.endContainer, 'highlight'), range.endContainer, range.endOffset);
});

/**
 *
 * @param {Node} ancestor
 * @param {Node} descendant
 * @param {number} descendantOffset
 */
function splitNodeAt (ancestor, descendant, descendantOffset) {

  let newNode, parentNode;

  if (dom.isCharacterDataNode(descendant)) {
    let descendantIndex = dom.getNodeIndex(descendant);
    if (descendantOffset === 0) {
      descendantOffset = descendantIndex;
    } else if (descendantOffset === descendant.length) {
      descendantOffset = descendantIndex + 1;
    }
    descendant = descendant.parentNode;
  }

  if (utils.isSplitPoint(descendant, descendantOffset)) {
    // todo
    newNode = descendant.cloneNode(false);
    parentNode = descendant.parentNode;
  }
}