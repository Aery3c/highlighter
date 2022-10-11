/**
 * string query tool, He has a trie inside
 *
 */

'use strict';

import Trie from '@/utils/trie';
import toType from '@/utils/toType';

export default class TextSearch {
  constructor () {
    this.trie = new Trie();
  }

  /**
   *
   * @param {string[] | string} words
   */
  setup (words) {
    // const trie = this.trie, root = trie.root;
    words = toType(words) === 'array' ? words : [words];
    //
    // for (const word of words) {
    //   if (!trie.search(word)) {
    //     trie.addWord(word);
    //   }
    // }
    //
    // const queue = [], tmpQueue = [];
    // /**
    //  *
    //  * @param {TrieNode} node
    //  */
    // const setQueue = node => {
    //   for (const key in node.children) {
    //     // todo
    //   }
    // }
  }
}