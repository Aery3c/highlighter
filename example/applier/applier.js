import '../init.scss';
import '../layout.scss';
import Applier from '@/applier';
import { gE } from '@/dom';

const applier = new Applier({ className: 'highlight', elAttrs: { style: 'background-color: yellow;' } });
const bold = new Applier({ className: 'bold', elAttrs: { style: 'background-color: red; font-weight: bold;' } });
const toggle = new Applier({ className: 'pink', elAttrs: { style: 'background-color: pink;' } })

gE('#highlight').addEventListener('click', () => {
  applier.highlightToRange(window.getSelection().getRangeAt(0));
});

gE('#unhighlight').addEventListener('click', () => {
  applier.unhighlightToRange(window.getSelection().getRangeAt(0));
});

gE('#bold').addEventListener('click', () => {
  bold.highlightToRange(window.getSelection().getRangeAt(0));
});

gE('#unbold').addEventListener('click', () => {
  bold.unhighlightToRange(window.getSelection().getRangeAt(0));
});

gE('#toggle').addEventListener('click', () => {

});
