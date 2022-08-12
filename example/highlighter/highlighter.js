import Highlighter from '@/highlighter';

import '../init.scss';
import '../layout.scss';

const highlighter = new Highlighter({ className: 'highlight', elAttrs: { style: 'background-color: yellow;' } });

document.querySelector('#highlightASelection').addEventListener('click', () => {
  highlighter.highlightASelection();
  highlighter.highlights.forEach(highlight => {
    highlight._inspect();
  })
});

document.querySelector('#highlightASelectionfirstP').addEventListener('click', () => {
  highlighter.highlightASelection({ referenceNodeId: 'first_p' });
  highlighter.highlights.forEach(highlight => {
    highlight._inspect();
  })
});