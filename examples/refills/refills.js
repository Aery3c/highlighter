// @flow
import { Refills } from '../../src';

const refills = new Refills({ tagName: 'span' });

document.getElementById('appliesToRange')?.addEventListener('click', () => {
  refills.appliesToRange(window.getSelection().getRangeAt(0));
});

document.getElementById('wipeToRange')?.addEventListener('click', () => {
  refills.wipeToRange(window.getSelection().getRangeAt(0));
});