'use strict'

import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';

const getFileName = (input) => {
  const arr = input.split('/');
  return arr[arr.length - 1].split('.')[0];
}

const inputs = ['src/refills.js'];
const bundles = [
  { inputs, format: 'umd', dir: 'build', minify: true, flow: true },
  { inputs, format: 'umd', dir: 'build' },
  { inputs, format: 'cjs', dir: 'build', flow: true },
];

const config = bundles
  .map(({ inputs, dir, format, minify, flow }) =>
    inputs.map(input => ({
      input,
      plugins: [
        resolve(),
        babel({ babelHelpers: 'bundled' })
      ],
      output: {
        name: 'highlighter',
        file: `${dir}/${format}/${getFileName(input)}${
          minify ? '.min' : ''
        }.js`,
        format,
        sourcemap: true,
      }
    }))
  )
  .flat();

export default config;