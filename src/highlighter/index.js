'use strict'

import core from '@/core';

export default class Highlighter {
  /**
   *
   * @param {string} className
   * @param {Object} [options]
   */
  constructor(className, options = {}) {
    this.highlights = [];
  }
  /**
   * highlight Selection
   *
   * @param {Selection} [selection]
   * @param {Object} [options]
   * @return {Highlight[]}
   */
  highlightSelection (selection, options) {
    let i = 0, containerElement, elAttrs, elProps, className;
    let target = arguments[i] || {};

    if (target instanceof Selection) {
      i++;
      target = arguments[i] || {};
    }

    if (core.utils.toType(target) !== 'object') {
      target = {};
    }
    selection = getSelection(selection);

    containerElement = target.containerElement;
    elAttrs = target.elAttrs;
    elProps = target.elProps;
    className = target.className;

    const characterRanges = selection.toCharacterRanges(containerElement), highlights = this.highlights;

    const removeToHighligts = [];
    characterRanges.forEach(cr => {
      if (cr.start === cr.end) {
        // ignore empty range
        return false;
      }

      let isRangeSame = false;
      // compare each range with the existing highlight range
      for (let i = 0, ht; (ht = highlights[i]); ++i) {
        const htcr = ht.characterRange;

        if (cr.isOverlap(htcr)) {
          // ignore same range
          isRangeSame = true;
          continue;
        }

        if (cr.isIntersects(htcr) || cr.isAdjoin(htcr)) {
          // range intersect joint
          cr = cr.union(htcr);
          removeToHighligts.push(ht);
          highlights.splice(i--, 1);
        }
      }

      if (!isRangeSame) {
        highlights.push(core.createHighlight(cr));
      }
    });

    // off
    removeToHighligts.forEach(removeHt => {
      if (removeHt.applied) {
        removeHt.unapply();
      }
    });

    // on
    const newHighlight = [];
    highlights.forEach(ht => {
      if (!ht.applied) {
        ht.apply();
        newHighlight.push(ht)
      }
    });

    return newHighlight;
  }
}

// /**
//  * highlight selection
//  */
// 'use strict'
// import core from '@/core';
//
// export default class Highlighter {
//   /**
//    *
//    * @param {string} name
//    * @param {Object} [options]
//    */
//   constructor(name, options) {
//     /** @type {Highlight[]} */
//     this.highlights = [];
//     this._applier = core.createApplier(name, options);
//     this.containerElement = options.containerElement;
//   }
//
//   /**
//    * highlight Selection
//    *
//    * 高亮当前的选中
//    * @param {Selection} [selection]
//    * @return {Highlight[]}
//    */
//   highlightSelection (selection) {
//     selection = getSelection(selection);
//
//     const characterRanges = serializeSelection(selection, this.containerElement);
//
//     const newHighlights = highlightCharacterRanges(characterRanges, this.highlights, this._applier);
//
//     restoreSelection(selection, characterRanges);
//
//     return newHighlights;
//   }
//
//   /**
//    * undo highlight in selection
//    *
//    * 从当前的选中撤销高亮
//    * @param {Selection} [selection]
//    * @return {Highlight[]}
//    */
//   unhighlightSelection (selection) {
//     selection = getSelection(selection);
//
//     const characterRanges = serializeSelection(selection, this.containerElement);
//
//     const newHighlights = unhighlightCharacterRanges(characterRanges, this.highlights, this._applier);
//
//     restoreSelection(selection, characterRanges);
//
//     return newHighlights;
//   }
//
//   /**
//    *
//    * @param {string} text
//    * @param {boolean} [scroll]
//    * @return {Highlight[]}
//    */
//   // highlightAllText (text, scroll = true) {
//   //   const highlights = this.highlights;
//   //   text = core.utils.stripAndCollapse(text);
//   //   if (text !== '') {
//   //     const fullText = this.containerElement.textContent,
//   //       matchArr = [...fullText.matchAll(new RegExp(`${text}`, 'gi'))]
//   //
//   //     matchArr.forEach(({ index: point }) => {
//   //       highlights.push(core.createHighlight(core.createCharacterRange(point, point + text.length, this.containerElement), this._applier));
//   //     });
//   //   }
//   //
//   //   const newHighlights = [];
//   //   highlights.forEach((ht, index) => {
//   //     if (!ht.applied) {
//   //       if (index === 0 && scroll) {
//   //         const rect = ht.characterRange.toRange().getBoundingClientRect();
//   //         if (rect.bottom < 0 || rect.top > window.innerHeight) {
//   //           window.scrollTo({ top: window.pageYOffset + rect.y - (window.innerHeight / 2), left: 0, behavior: 'smooth' });
//   //         }
//   //       }
//   //       ht.apply();
//   //       newHighlights.push(ht);
//   //     }
//   //   });
//   //
//   //   return newHighlights;
//   // }
//
//   /**
//    * 根据node节点获取highlight对象
//    * @param {HTMLElement} el
//    * @return {Highlight | null}
//    */
//   getHighlightFromElement (el) {
//     for (let highlight of this.highlights) {
//       if (highlight.containsNode(el)) {
//         return highlight;
//       }
//     }
//
//     return null
//   }
//
//   /**
//    *
//    * @return {Highlight[]}
//    */
//   getAllHighlight () {
//     const sortHighlight = [];
//     this.highlights.forEach(h => sortHighlight.push(h));
//     return sortHighlight.sort((a, b) => a.characterRange.start - b.characterRange.start);
//   }
//
//   addHighlight (highlight) {
//     if (highlight instanceof core.Highlight && !(highlight in this.highlights)) {
//       this.highlights.push(highlight);
//       this.highlights.forEach(ht => {
//         if (!ht.applied) {
//           ht.apply();
//         }
//       });
//     }
//   }
//
//   /**
//    * remove highlight
//    *
//    * 删除高亮
//    * @param {Highlight[]} highlights
//    */
//   removeHighlights (highlights) {
//     if (Array.isArray(highlights) && highlights.length) {
//       let i = 0, highlight, len = this.highlights.length;
//       for (; i < len; ++i) {
//         highlight = this.highlights[i];
//         if (highlights.indexOf(highlight) > -1) {
//           if (highlight.applied) {
//             highlight.unapply();
//           }
//           this.highlights.splice(i--, 1);
//         }
//       }
//     }
//   }
//
//   removeAllHighlight () {
//     for (let i = 0, highlight; (highlight = this.highlights[i]); ++i) {
//       if (highlight.applied) {
//         highlight.unapply();
//       }
//       this.highlights.splice(i--, 1);
//     }
//   }
// }
//
// /**
//  *
//  * @param {CharacterRange[]} characterRanges
//  * @param {Highlight[]} highlights
//  * @param {Applier} applier
//  * @return {Highlight[]}
//  */
// function unhighlightCharacterRanges (characterRanges, highlights, applier) {
//   const removeToHighlights = [];
//   characterRanges.forEach(cr => {
//     if (cr.start === cr.end) {
//       // ignore empty range
//       return false;
//     }
//
//     let highlight, i;
//     for (i = 0; (highlight = highlights[i]); ++i) {
//       const htcr = highlight.characterRange;
//       if (cr.isIntersects(htcr)) {
//         // isIntersects
//         const intersect = cr.intersection(htcr);
//         const complements = htcr.complementarySet(intersect);
//         complements.forEach(complement => {
//           // add complement
//           highlights.push(core.createHighlight(complement, applier));
//         });
//         removeToHighlights.push(highlight);
//         highlights.splice(i--, 1);
//       }
//     }
//   });
//
//   // off
//   const unHighlights = [];
//   removeToHighlights.forEach(removeHt => {
//     if (removeHt.applied) {
//       removeHt.unapply();
//       unHighlights.push(removeHt);
//     }
//   });
//
//   // on
//   highlights.forEach(ht => {
//     if (!ht.applied) {
//       ht.apply();
//     }
//     return ht;
//   });
//
//   return unHighlights;
// }
//
// /**
//  * highlight characterRanges
//  * @param {CharacterRange[]} characterRanges
//  * @param {Highlight[]} highlights
//  * @param {Applier} applier
//  * @return {Highlight[]}
//  */
// function highlightCharacterRanges (characterRanges, highlights, applier) {
//   const removeToHighligts = [];
//   characterRanges.forEach(cr => {
//     if (cr.start === cr.end) {
//       // ignore empty range
//       return false;
//     }
//
//     let isRangeSame = false;
//     // compare each range with the existing highlight range
//     for (let i = 0, ht; (ht = highlights[i]); ++i) {
//       const htcr = ht.characterRange;
//
//       if (cr.isOverlap(htcr)) {
//         // ignore same range
//         isRangeSame = true;
//         continue;
//       }
//
//       if (cr.isIntersects(htcr) || cr.isAdjoin(htcr)) {
//         // range intersect joint
//         cr = cr.union(htcr);
//         removeToHighligts.push(ht);
//         highlights.splice(i--, 1);
//       }
//     }
//
//     if (!isRangeSame) {
//       highlights.push(core.createHighlight(cr, applier));
//     }
//   });
//
//   // off
//   removeToHighligts.forEach(removeHt => {
//     if (removeHt.applied) {
//       removeHt.unapply();
//     }
//   });
//
//   // on
//   const newHighlight = [];
//   highlights.forEach(ht => {
//     if (!ht.applied) {
//       ht.apply();
//       newHighlight.push(ht)
//     }
//   });
//
//   return newHighlight;
// }
//
// /**
//  *
//  * @param {Selection} selection
//  * @param {HTMLElement} [containerElement]
//  * @return {CharacterRange[]}
//  */
// function serializeSelection (selection, containerElement) {
//   const ranges = selection.getAllRange();
//   return ranges.map(range => range.toCharacterRange(containerElement));
// }
//
function getSelection (selection) {
  return (selection instanceof Selection && selection)
    || window.getSelection();
}
//
// /**
//  *
//  * @param {Selection} selection
//  * @param {CharacterRange[]} characterRanges
//  */
// function restoreSelection (selection, characterRanges) {
//   selection.removeAllRanges();
//   characterRanges.forEach(characterRange => {
//     const range = characterRange.toRange();
//     selection.addRange(range);
//   });
// }
