import { createCharacterRange, utils } from '@/index';

utils.highlightACharacterRange(createCharacterRange(4, 20), { className: 'pink' });

setTimeout(function () {
  utils.highlightACharacterRange(createCharacterRange(15, 18));
  setTimeout(function () {
    utils.unhighlightACharacterRange(createCharacterRange(4, 20), { className: 'pink' });

  }, 2000);
}, 2000);
