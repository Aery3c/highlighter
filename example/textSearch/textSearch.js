import TextSearch from '@/highlighter/textSearch';
// import { wordList } from './random-words';

const textSearch = new TextSearch();
const content = document.body.textContent;
console.time('test wordList');
textSearch.setup(['math', 'Nash Equilibrium']);
const positions = textSearch.find(content, false);
console.log(positions);
console.timeEnd('test wordList');
console.log(textSearch.trie);