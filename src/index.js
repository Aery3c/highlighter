import './core/range';
import './core/selection';
import Highlighter from './highlighter';
import Highlight from './core/highlight';
import CharacterRange from './core/characterRange';
import Applier from './core/applier';
import * as utils from './utils';
import * as dom from './dom';

Highlighter.utils = utils;
Highlighter.dom = dom;
Highlighter.Highlight = Highlight;
Highlighter.CharacterRange = CharacterRange;
Highlighter.Applier = Applier;

export default Highlighter
