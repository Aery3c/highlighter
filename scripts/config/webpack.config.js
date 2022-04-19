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
  const entry = {};
  const resolve = {};
  entry.highlighter = {
    import: paths.appIndexJs,
    library: {
      name: 'Highlighter',
      type: 'umd',
      export: 'default',
    },
  }
  if (isEnvDevelopment) {
    const htmls = finder(paths.templateDir, 'html');
    // add html-webpack-plugin
    htmls.forEach(html => {
      const filename = path.parse(html).base;
      plugins.push(new HtmlWebpackPlugin({ ...createHtmlOptions(filename, html) }));
    });

    // add entry file
    Object.assign(entry, { ...createEntry() })

    resolve.alias = {
      '@': paths.appSrc
    }
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
          oneOf: [
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
            },
            {
              test: /\.s[ac]ss$/i,
              use: [
                'style-loader',
                'css-loader',
                'sass-loader',
              ],
            },
          ]
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
    ],
    resolve
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
    inject: 'body',
    // chunks: [name, 'highlighter']
    chunks: [name]
  }
}

function createEntry () {
  const jsArr = finder(paths.templateDir, 'js');
  const entry = {};
  jsArr.forEach(js => {
    entry[path.parse(js).base.split('.')[0]] = js;
  });
  return entry;
}
