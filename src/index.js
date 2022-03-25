import Highlighter from './highlighter';
import enhanceRangePrototype from './core/range';
import enhanceSelectionPrototype from './core/selection';

Object.assign(Range.prototype, enhanceRangePrototype);

Object.assign(Selection.prototype, enhanceSelectionPrototype);

export default Highlighter;
