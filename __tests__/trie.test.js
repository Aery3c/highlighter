'use strict';

import { describe, it, expect } from '@jest/globals';
import Trie from '@/utils/trie';

describe('.Trie', function () {

  describe('.add', function () {
    it('add words as normal', function () {

      const trie = new Trie();
      trie.addWord('hello');
      expect(trie.search('hello')).toBeTruthy();

      expect(trie.search('world')).toBeFalsy();
      trie.addWord('world');
      expect(trie.search('world')).toBeTruthy();
    });

    it('when the argument is an array of strings', function () {
      const trie = new Trie();

      trie.addWord(['h', 'e', 'l', 'l', 'o']);

      expect(trie.search('hello')).toBeTruthy();

      trie.addWord(['wo', 'r', 'l', 'd']);
      expect(trie.search('world')).toBeFalsy();
    });

    it('argument is not an iteration object', function () {
      const trie = new Trie();

      expect(() => {
        trie.addWord(true)
      }).toThrowError();
    });

  });

  describe('.startsWith', function () {
    it('prefix letter test', function () {
      const trie = new Trie();
      ['free', 'freedom', 'feel', 'feeling'].forEach(word => {
        trie.addWord(word);
      });

      expect(trie.startsWith('fr')).toBeTruthy();
      expect(trie.startsWith('fre')).toBeTruthy();

      expect(trie.startsWith('fee')).toBeTruthy();

      expect(trie.startsWith('afre')).toBeFalsy();
    });
  });

  describe('.remove', function () {
    it('whether words can be found after they have been deleted', function () {
      const trie = new Trie();
      trie.addWord('hello');
      expect(trie.search('hello')).toBeTruthy();
      trie.removeWord('hello');
      expect(trie.search('hello')).toBeFalsy();
    });

    it('the deleted data structure meets expectations', function () {
      const trie = new Trie();
      trie.addWord('hello');
      trie.addWord('hello world');

      trie.removeWord('hello');
      let res, current = trie.root;
      for (const char of 'hello') {
        current = current.children[char];
        res = current.isEnd;
      }
      expect(res).toBeFalsy();

      trie.removeWord('hello world');

      expect(Object.keys(trie.root.children).length).toBe(0);
    });
  });

});
