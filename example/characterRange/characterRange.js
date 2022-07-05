import { createCharacterRange, utils } from '@/index';


const characterRange = createCharacterRange(4, 20);
utils.highlightACharacterRange(characterRange);

const c2 = createCharacterRange(15, 18);

setTimeout(function () {
  utils.highlightACharacterRange(c2);
  setTimeout(function () {
    utils.unhighlightACharacterRange(createCharacterRange(15, 18));

  }, 2000);
}, 2000);
