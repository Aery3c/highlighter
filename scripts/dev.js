#!/usr/bin/env node
'use strict'

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const chalk = require('chalk');
const clearConsole = require('./utils/clearConsole');
const configFactory = require('./config/webpack.config');
const createCompiler = require('./utils/createCompiler');

const isInteractive = process.stdout.isTTY;

const config = configFactory('development');
const compiler = createCompiler({
  config,
  webpack
})

const devServer = new WebpackDevServer({
  hot: true,
  compress: true,
  // open: ['/dist/demos/'],
  static: './',
  port: 3000,
  devMiddleware: {
    writeToDisk: true
  }
}, compiler);

devServer.startCallback(() => {
  if (isInteractive) {
    clearConsole();
  }

  console.log(chalk.cyan('Starting the development server...\n'));

  ['SIGINT', 'SIGTERM'].forEach(function (sig) {
    process.on(sig, function () {
      devServer.close();
      process.exit();
    });
  });

  if (process.env.CI !== 'true') {
    // Gracefully exit when stdin ends
    process.stdin.on('end', function () {
      devServer.close();
      process.exit();
    });
  }
})