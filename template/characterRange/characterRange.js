import { createCharacterRange, utils } from '@/index';


const characterRange = createCharacterRange(4, 20);
utils.highlightACharacterRange(characterRange);

const c2 = createCharacterRange(19, 25);

setTimeout(function () {
  utils.highlightACharacterRange(c2);
  setTimeout(function () {
    utils.unhighlightACharacterRange(createCharacterRange(5, 23));

  }, 2000);
}, 2000);
