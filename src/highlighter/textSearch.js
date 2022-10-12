/**
 * string query tool, He has a trie inside
 *
 */

/**
 * @typedef {{ children: {}, isRoot?: boolean, isEnd: boolean, pre: TrieNode, length: number; }} TrieNode
 *
 */

'use strict';

import Trie from '@/utils/trie';
import toType from '@/utils/toType';

class Position {
  constructor(start, end, string) {
    this.start = start;
    this.end = end;
    this.string = string;
  }
}

export default class TextSearch {
  constructor () {
    this.trie = new Trie();
  }

  /**
   * building trie
   * @param {string[] | string} words
   */
  setup (words) {
    const trie = this.trie, root = trie.root;
    words = toType(words) === 'array' ? words : [words];

    for (let word of words) {
      if (!trie.search(word)) {
        trie.addWord(word);
      }
    }

    const tmpQueue = [];

    root.isRoot = true;
    root.length = 0;
    const setQueue = node => {
      for (const key in node.children) {
        node.children[key].length = node.length + 1;
        node.children[key].pre = node;
        tmpQueue.push(node.children[key]);
      }

      if (tmpQueue.length) {
        setQueue(tmpQueue.shift());
      }
    }

    setQueue(root);
  }

  /**
   *
   * @param {string} word
   * @param {boolean} [aCaseSensitive] - A boolean value. If true, specifies a case-sensitive search.
   * @return {Position[]}
   */
  findAll (word, aCaseSensitive = false) {
    let node = this.trie.root, results = [], result;
    for (const [i, char] of word.split('').entries()) {
      node = this._findNodeOfChar(node, char, aCaseSensitive);
      result = this._getPosition(node, i, word);
      if (result) {
        results.push(result);
      }
    }

    return results;
  }

  /**
   *
   * @param {string} word
   * @param {boolean} [aCaseSensitive]
   * @return {Position | null}
   */
  find (word, aCaseSensitive = false) {
    let node = this.trie.root;
    for (const [i, char] of word.split('').entries()) {
      node = this._findNodeOfChar(node, char, aCaseSensitive);
      let result = this._getPosition(node, i, word);
      if (result) return result;
    }

    return null;
  }

  /**
   *
   * @param {TrieNode} node
   * @param {string} char
   * @param {boolean} aCaseSensitive
   * @return {TrieNode}
   * @private
   */
  _findNodeOfChar (node, char, aCaseSensitive) {
    if (!aCaseSensitive) {
      const nextNode = node.children[char.toLowerCase()] || node.children[char.toUpperCase()];
      if (nextNode) return nextNode;
    } else if (node.children[char]) {
      return node.children[char];
    }

    if (node.isRoot) {
      return this.trie.root;
    }
    return this._findNodeOfChar(node.pre, char, aCaseSensitive);
  }

  /**
   *
   * @param {TrieNode} node
   * @param {number} pos
   * @param {string} str
   * @return {Position | null}
   * @private
   */
  _getPosition (node, pos, str) {
    if (node.isEnd) {
      const start = pos - node.length + 1;
      const end = pos + 1;
      const string = str.substring(start, end);
      return new Position(start, end, string);
    }

    return null
  }
}