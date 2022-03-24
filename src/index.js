import Highlighter from './highlighter';
import enhancePrototype from './core/range';

Object.assign(Range.prototype, enhancePrototype);

export default Highlighter;
