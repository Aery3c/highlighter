import { describe, it, expect } from '@jest/globals';
import { Trie } from '@/index';

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
    // todo
  });

  describe('.remove', function () {
    // todo
  });

});
