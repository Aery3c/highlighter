// @flow

class Position {
  start: number;
  end: number;
  string: string;
  constructor(start: number, end: number, string: string) {
    this.start = start;
    this.end = end;
    this.string = string;
  }
}

class TextSearch {
  trie: Trie;
  constructor () {
    this.trie = new Trie();
  }

  /**
   * building trie
   * @param {string[] | string} words
   */
  setup (words: string[] | string) {
    const trie = this.trie, root = trie.root;
    words = Array.isArray(words) ? words : [words];

    for (let word of words) {
      if (!trie.search(word)) {
        trie.addWord(word);
      }
    }

    const tmpQueue = [];

    root.isRoot = true;
    root.length = 0;
    const setQueue = (node: TrieNode) => {
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

  find (str: string): Position[] {
    let node = this.trie.root, results = [], result;
    for (const [i, char] of str.split('').entries()) {
      node = this._findNodeOfChar(node, char);
      result = this._getPosition(node, i, str);
      if (result) {
        results.push(result);
      }
    }

    return results;
  }

  _findNodeOfChar (node: TrieNode, char: string): TrieNode {
    if (node.children[char]) {
      return node.children[char];
    }

    if (node.isRoot) {
      return this.trie.root;
    }
    return this._findNodeOfChar(node.pre, char);
  }

  _getPosition (node: TrieNode, pos: number, str: string): Position | null {
    if (node.isEnd) {
      const start = pos - node.length + 1;
      const end = pos + 1;
      const string = str.substring(start, end);
      return new Position(start, end, string);
    }

    return null
  }
}

class TrieNode {
  char: string;
  isEnd: boolean;
  children: { [key: any]: any; }
  isRoot: boolean;
  length: number;
  pre: TrieNode;
  constructor(char: string) {
    this.char = char;
    this.isEnd = false;
    this.children = {};
  }
}

class Trie {
  root: TrieNode;
  constructor() {
    this.root = new TrieNode('');
  }

  addWord (word: string) {
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

  search (word: string): boolean {
    let current = this.root;

    for (const char of word) {
      if (!current.children[char]) {
        return false
      }
      current = current.children[char];
    }

    return current.isEnd;
  }
  startsWith (word: string): boolean {
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
  removeWord (word: string) {
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

function containsWords (node: TrieNode): boolean {
  if (node.isEnd) {
    return true;
  }

  for (const key in node.children) {
    // $FlowIgnore
    if (Object.hasOwn(node.children, key)) {
      if (containsWords(node.children[key])) {
        return true;
      }
    }
  }

  return false;
}

export default TextSearch;