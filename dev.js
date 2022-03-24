#!/usr/bin/env node
'use strict'

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const webpackDevServer = require('webpack-dev-server');
const path = require('path');

const config = {
  entry: path.resolve(__dirname, 'src/index.js'),
  devtool: 'eval-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'highlighter.dev.js',
    publicPath: '/',
    library: {
      name: 'Highlighter',
      type: 'umd',
      export: 'default',
    },
    globalObject: 'this'
  },
  devServer: {
    hot: true,
    compress: true,
    open: true,
    port: 3000,
  },
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin({
      title: 'test',
      filename: 'demos/test.html',
      template: path.resolve(__dirname, 'template/test.html'),
      publicPath: '../',
      scriptLoading: 'blocking'
    }),
    new ESLintPlugin()
  ]
};

const compiler = webpack(config);
const devServerOptions = { ...config.devServer };
const server = new webpackDevServer(devServerOptions, compiler);

const runServer = async () => {
  console.log('Starting server...');
  await server.start();
};

runServer();
