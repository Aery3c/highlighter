'use strict'

const paths = require('./paths');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
const finder = require('../utils/finder');

module.exports = function (webpackEnv) {
  const isEnvDevelopment = webpackEnv === 'development';
  const isEnvProduction = webpackEnv === 'production';

  const plugins = [];

  if (isEnvDevelopment) {
    const htmlPaths = finder(paths.templateDir, 'html');
    htmlPaths.forEach(p => {
      const filename = path.parse(p).base;
      plugins.push(new HtmlWebpackPlugin({ ...createHtmlOptions(filename, p) }));
    });
  }

  const entry = {
    highlighter: {
      import: paths.appIndexJs,
      library: {
        name: 'Highlighter',
        type: 'umd',
        export: 'default',
      },
    },
  };
  if (isEnvDevelopment) {
    Object.assign(entry, { ...createEntry() })
  }

  return {
    stats: 'errors-warnings',
    mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
    devtool: isEnvProduction
      ? shouldUseSourceMap
        ? 'source-map'
        : false
      : isEnvDevelopment && 'cheap-module-source-map',
    bail: isEnvProduction,
    entry,
    output: {
      path: paths.appBuild,
      filename: isEnvProduction ? 'highlighter.build.js' : isEnvDevelopment && '[name].dev.js',
      globalObject: 'this'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-transform-runtime']
            }
          }
        }
      ]
    },
    plugins: [
      new ESLintPlugin({
        failOnWarning: false,
        quiet: true
      }),
      new ProgressBarPlugin(),
      ...plugins
    ]
  }
}

function createHtmlOptions (filename, path) {
  const name = filename.split('.')[0];
  return {
    title: name,
    filename: `demos/${filename}`,
    template: path,
    publicPath: '../',
    scriptLoading: 'blocking',
    inject: 'head',
    chunks: [name, 'highlighter']
  }
}

function createEntry () {
  const jsPaths = finder(paths.templateDir, 'js');
  const entry = {};
  jsPaths.forEach(js => {
    entry.applier = js;
  });
  return entry;
}
