// @flow
'use strict'

import Highlighter from '../../src/highlighter';
const cookieKey = 'highlights';
const highlighter = new Highlighter();

// highlighter.deserialize([{ start: 20, end: 21, referenceNodeId: 'main' }]);

if (checkACookieExists(cookieKey)) {
  highlighter.deserialize(JSON.parse(geCookie(cookieKey)));
}

document.querySelector('.main')?.addEventListener('mouseup', () => {
  const range = window.getSelection().getRangeAt(0);
  if (range.toString() !== '' && !range.collapsed) {
    highlighter.useSelection({ selection: window.getSelection().getRangeAt(0), referenceNodeId: 'main' });
  }
});

document.getElementById('submit')?.addEventListener('click', () => {
  const serialize = JSON.stringify(highlighter.serialize());
  setCookie(cookieKey, serialize);
  window.location.reload();
});

highlighter.on('click', (highlight) => {
  if (window.confirm(`remove highlight ${highlight.highlightId} ??`)) {
    highlighter.removeHighlight(highlight);
    const serialize = JSON.stringify(highlighter.serialize());
    setCookie(cookieKey, serialize);
  }
});

function setCookie (key: string, value: string): void {
  document.cookie = `${key}=${value}`;
}

function checkACookieExists (key: string): boolean {
  return document.cookie.split(";").some((item) => item.trim().startsWith(`${key}=`));
}

function geCookie (key: string): string {
  // $FlowIgnore
  return document.cookie.split('; ').find((row) => row.startsWith(`${key}=`))?.split("=")[1];
}