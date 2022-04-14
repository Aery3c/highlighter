#!/usr/bin/env node
'use strict'

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const fs = require('fs');
const paths = require('./config/paths');
const chalk = require('chalk');
const { choosePort, prepareUrls } = require('react-dev-utils/WebpackDevServerUtils');
const openBrowser = require('react-dev-utils/openBrowser');
const clearConsole = require('react-dev-utils/clearConsole');
const configFactory = require('./config/webpack.config');
const createCompiler = require('./utils/createCompiler');
const createDevServerConfig = require('./config/server');

const useYarn = fs.existsSync(paths.yarnLockFile);
const appName = require(paths.appPackageJson).name;
const isInteractive = process.stdout.isTTY;

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

choosePort(HOST, DEFAULT_PORT)
  .then(port => {
    if (port === null) {
      return;
    }

    const config = configFactory('development');

    const urls = prepareUrls('http', HOST, port);
    const compiler = createCompiler({
      appName,
      config,
      urls,
      useYarn,
      webpack
    })

    const serverConfig = {
      ...createDevServerConfig(),
      static: {
        directory: paths.appBuild,
        serveIndex: true,
      },
      port,
    }

    const devServer = new WebpackDevServer(serverConfig, compiler);

    devServer.startCallback(() => {
      if (isInteractive) {
        clearConsole();
      }

      console.log(chalk.cyan('Starting the development server...\n'));
      openBrowser(urls.localUrlForBrowser);

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

    });

  })
  .catch(err => {
    if (err && err.message) {
      console.log(err.message);
    }
    process.exit(1);
  });
