import '../init.scss';
import '../layout.scss';
import Refills from '@/refills';
import { gE } from '@/dom';

const refills = new Refills({ className: 'highlight', elAttrs: { style: 'background-color: yellow;' } });
const bold = new Refills({ className: 'bold', elAttrs: { style: 'background-color: red; font-weight: bold;' } });
// const pink = new Refills({ className: 'pink', elAttrs: { style: 'background-color: pink;' } })

gE('#highlight').addEventListener('click', () => {
  refills.appliesToRange(window.getSelection().getRangeAt(0));
});

gE('#unhighlight').addEventListener('click', () => {
  refills.wipeToRange(window.getSelection().getRangeAt(0));
});

gE('#bold').addEventListener('click', () => {
  bold.appliesToRange(window.getSelection().getRangeAt(0));
});

gE('#unbold').addEventListener('click', () => {
  bold.wipeToRange(window.getSelection().getRangeAt(0));
});

gE('#toggle').addEventListener('click', () => {
  const range = window.getSelection().getRangeAt(0);
  if (refills.isAppliedToRange(range)) {
    refills.wipeToRange(range);
  } else {
    refills.appliesToRange(range);
  }
});
