#!/usr/bin/env node
'use strict'

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const config = {
  entry: path.resolve(__dirname, 'src/highlighter'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'highlighter.bundle.js'
  },
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin({
      title: 'test',
      filename: 'demos/test.html',
      template: path.resolve(__dirname, 'template/test.html')
    })
  ]
};

const compiler = webpack(config);
compiler.run((err, stats) => {
  if (err) {
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
    return;
  }

  const info = stats.toJson();

  if (stats.hasErrors()) {
    console.error(info.errors);
  }

  if (stats.hasWarnings()) {
    console.warn(info.warnings);
  }
});