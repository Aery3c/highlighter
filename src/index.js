import './core/range';
import './core/selection';
import Highlighter from './highlighter';
import Highlight from './core/highlight';
import CharacterRange from './core/characterRange';
import * as utils from './utils';
import * as dom from './dom';

Highlighter.utils = utils;
Highlighter.dom = dom;
Highlighter.Highlight = Highlight;
Highlighter.CharacterRange = CharacterRange;

export default Highlighter
