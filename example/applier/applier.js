import '../init.scss';
import '../layout.scss';
import Applier from '@/applier';

const applier = new Applier({ tagName: 'span', className: 'highlight' });

document.addEventListener('mouseup', function () {
  applier.highlightToRange(window.getSelection().getRangeAt(0));
});