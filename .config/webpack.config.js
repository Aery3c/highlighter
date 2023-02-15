'use strict'
const paths = require('../scripts/paths');
const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const expDirs = mapExamplesDirectory();

const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

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
    entry: {
      ...getExampleEntry(expDirs)
    },
    output: {
      path: paths.dist,
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-flow']
            }
          }
        }
      ]
    },
    plugins: [
      ...expDirs.map(exp => {
        const name = path.parse(exp).name;
        return new HtmlWebpackPlugin({
          title: name,
          filename: `example/${name}.html`,
          template: path.join(exp, `${name}.html`),
          publicPath: '../',
          scriptLoading: 'blocking',
          inject: 'body',
          chunks: [name]
        })
      }),
      new CircularDependencyPlugin({
        exclude: /node_modules/,
        include: /src/,
        failOnError: true,
        allowAsyncCycles: false,
        cwd: process.cwd(),
      }),
      // new FlowWebpackPlugin(),
      new ESLintPlugin({
        failOnWarning: false,
        quiet: false,
      }),
    ]
  }
}

/**
 * get all file paths under the examples folder
 * @return {string[]}
 */
function mapExamplesDirectory () {
  const fileNames = fs.readdirSync(paths.examples);

  return fileNames.map(name => {
    const filePath = path.join(paths.examples, name);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      return filePath;
    }
  }).filter(item => !!item);
}

function getExampleEntry (examplesPathList) {
  const entry = {};
  examplesPathList.forEach(d => {
    const name = path.parse(d).name;
    entry[name] = path.join(d, name)
  });
  return entry;
}