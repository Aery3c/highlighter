import { createCharacterRange, utils } from '@/index';


const characterRange = createCharacterRange(4, 20);
utils.highlightACharacterRange(characterRange);

const c2 = createCharacterRange(19, 25);
utils.highlightACharacterRange(c2);
