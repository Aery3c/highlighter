'use strict'

import core from '@/core';

const defaultStyle = [
  'background-color: rgb(254, 232, 195)',
  'color: rgb(51, 51, 51)'
];

const getDefaultOptions = () => ({
  tagName: core.TAG_NAME,
  containerElement: core.CONTEXT,
  className: core.DEFAULT_CLASS_NAME,
  elAttrs: {
    style: defaultStyle.join(';')
  },
  elProps: {}
});

export default getDefaultOptions;