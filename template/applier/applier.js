import { createApplier, dom } from '@/index';

const applier = createApplier();

dom.gE('#applies').addEventListener('click', function () {
  applier.applies(window.getSelection().getRangeAt(0));
});

dom.gE('#unApplies').addEventListener('click', function () {
  applier.unApplies(window.getSelection().getRangeAt(0));
});