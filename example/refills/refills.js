import '../init.scss';
import '../layout.scss';
import Refills from '@/refills';
import { gE } from '@/dom';

const applier = new Refills({ className: 'highlight', elAttrs: { style: 'background-color: yellow;' } });
const bold = new Refills({ className: 'bold', elAttrs: { style: 'background-color: red; font-weight: bold;' } });
const toggle = new Refills({ className: 'pink', elAttrs: { style: 'background-color: pink;' } })

gE('#highlight').addEventListener('click', () => {
  applier.appliesToRange(window.getSelection().getRangeAt(0));
});

gE('#unhighlight').addEventListener('click', () => {
  applier.wipeToRange(window.getSelection().getRangeAt(0));
});

gE('#bold').addEventListener('click', () => {
  bold.appliesToRange(window.getSelection().getRangeAt(0));
});

gE('#unbold').addEventListener('click', () => {
  bold.wipeToRange(window.getSelection().getRangeAt(0));
});

gE('#toggle').addEventListener('click', () => {

});
