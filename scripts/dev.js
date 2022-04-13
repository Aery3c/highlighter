#!/usr/bin/env node
'use strict'

const webpack = require('webpack');
const paths = require('./config/paths');
const fs = require('fs');
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
  static: {
    directory: paths.appBuild,
    serveIndex: true,
  },
  port: 3000,
  devMiddleware: {
    writeToDisk: true,
  },
  client: {
    progress: true
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
      fs.rmdirSync(paths.appBuild, { recursive: true });
      console.log();
      console.log(chalk.green(`rmdir to ${paths.appBuild}`));
      console.log();
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
