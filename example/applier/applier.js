import '../init.scss';
import '../layout.scss';
import Applier from '@/applier';

const applier = new Applier({ className: 'highlight' });

document.querySelector('#highlightToRange').addEventListener('click', function () {
  applier.highlightToRange(window.getSelection().getRangeAt(0));
});

document.querySelector('#unhighlightToRange').addEventListener('click', function () {
  applier.unhighlightToRange(window.getSelection().getRangeAt(0));
});
