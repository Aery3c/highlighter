'use strict'

import './canvas.scss';

const canvas = document.querySelector('#canvas');

window.onload = function () {
  canvas.width = document.body.offsetWidth;
  canvas.height = document.body.offsetHeight;
}

