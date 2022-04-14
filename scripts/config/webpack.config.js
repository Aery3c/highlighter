'use strict'

const fs = require('fs');
const paths = require('./paths');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

function createHtmlWebpackPlugin(isEnvDevelopment) {
  const results = [];
  if (isEnvDevelopment) {
    let files = fs.readdirSync(paths.templateDir).filter(filename => /\.html$/.test(filename));
    files.forEach(filename => {
      results.push(
        new HtmlWebpackPlugin({
          title: filename.split('.')[0],
          filename: `demos/${filename}`,
          template: path.resolve(paths.templateDir, filename),
          publicPath: '../',
          scriptLoading: 'blocking',
          inject: 'head',
        })
      )
    });
  }

  return results;
}

module.exports = function (webpackEnv) {
  const isEnvDevelopment = webpackEnv === 'development';
  const isEnvProduction = webpackEnv === 'production';

  return {
    stats: 'errors-warnings',
    mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
    devtool: isEnvProduction
      ? shouldUseSourceMap
        ? 'source-map'
        : false
      : isEnvDevelopment && 'cheap-module-source-map',
    bail: isEnvProduction,
    entry: paths.appIndexJs,
    output: {
      path: paths.appBuild,
      filename: isEnvProduction ? 'highlighter.build.js' : isEnvDevelopment && 'highlighter.dev.js',
      publicPath: '/',
      library: {
        name: 'Highlighter',
        type: 'umd',
        export: 'default',
      },
      globalObject: 'this'
    },
    plugins: [
      ...createHtmlWebpackPlugin(isEnvDevelopment),
      new ESLintPlugin({
        failOnWarning: false,
        // formatter: require.resolve('eslint-formatter-mo'),
        quiet: true
      }),
      new ProgressBarPlugin()
    ]
  }
}
