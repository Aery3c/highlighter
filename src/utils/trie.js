/**
 * js implementation of Trie
 *
 * The root node contains no characters, and every node except the root node contains only one character.
 *
 * From the root node to a node, the characters passing through the path are concatenated, which is the corresponding string of the node;
 *
 * All children of each node contain different characters.
 */
'use strict'

class TrieNode {
  /**
   *
   * @param {string} char
   */
  constructor(char) {
    this.char = char;
    this.isEnd = false;
    this.children = {};
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode('');
  }

  /**
   *
   * @param {string} word
   */
  addWord (word) {
    let current = this.root, next;

    for (const char of word) {
      next = current.children[char];
      if (!next) {
        current.children[char] = next = new TrieNode(char);
      }
      current = next;
    }

    current.isEnd = true;
  }

  /**
   *
   * @param {string} word
   * @return {boolean}
   */
  search (word) {
    let current = this.root;

    for (const char of word) {
      if (!current.children[char]) {
        return false
      }
      current = current.children[char];
    }

    return current.isEnd;
  }

  /**
   *
   * @param {string} word
   * @return {boolean}
   */
  startsWith (word) {
    let current = this.root;

    for (const char of word) {
      if (!current.children[char]) {
        return false
      }

      current = current.children[char];
    }

    return containsWords(current);
  }

  /**
   *
   * @param {string} word
   */
  removeWord (word) {
    let current = this.root;
    const hierarchy = [current];
    const words = [];

    for (let piece of word) {
      words.unshift(piece);
      if (!current.children[piece]) {
        return;
      }

      current = current.children[piece];
      hierarchy.unshift(current);
    }

    current.isEnd = false;

    for (let j = 0; j < hierarchy.length; j++) {
      if (Object.keys(hierarchy[j].children).length > 0 || hierarchy[j].isEnd) {
        break;
      }

      if (j + 1 < hierarchy.length) {
        delete hierarchy[j + 1].children[words[j]];
      }
    }
  }

}

/**
 *
 * @param {TrieNode} node
 * @return {boolean}
 */
function containsWords (node) {
  if (node.isEnd) {
    return true;
  }

  for (const key in node.children) {
    if (Object.hasOwn(node.children, key)) {
      if (containsWords(node.children[key])) {
        return true;
      }
    }
  }

  return false;
}

export default Trie;
