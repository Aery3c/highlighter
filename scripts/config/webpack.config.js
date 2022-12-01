'use strict'

const paths = require('./paths');
const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin')
const CopyPlugin = require("copy-webpack-plugin");

const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

module.exports = function (webpackEnv) {
  const isEnvDevelopment = webpackEnv === 'development';
  const isEnvProduction = webpackEnv === 'production';

  const fileNames = fs.readdirSync(paths.exampleDir);
  const examples = fileNames.map(name => {
    const filePath = path.join(paths.exampleDir, name);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      return filePath;
    }
  }).filter(item => !!item);

  const htmlWebpackPlugins = examples.map(d => {
    const name = path.parse(d).name;
    return new HtmlWebpackPlugin({
      title: name,
      filename: `example/${name}.html`,
      template: path.join(d, `${name}.html`),
      publicPath: '../',
      scriptLoading: 'blocking',
      inject: 'body',
      chunks: [name]
    })
  });

  return {
    stats: 'errors-warnings',
    mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
    devtool: isEnvProduction
      ? shouldUseSourceMap
        ? 'source-map'
        : false
      : isEnvDevelopment && 'cheap-module-source-map',
    bail: isEnvProduction,
    entry: {
      highlighter: {
        import: paths.appIndexJs,
        library: {
          name: 'Highlighter',
          type: 'umd',
          export: 'default',
        },
      },
      ...getEntrys(examples)
    },
    output: {
      path: paths.appBuild,
      filename: isEnvProduction ? '[name].js' : isEnvDevelopment && '[name].dev.js',
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
      new CircularDependencyPlugin({
        // exclude detection of files based on a RegExp
        exclude: /node_modules/,
        // include specific files based on a RegExp
        include: /src/,
        // add errors to webpack instead of warnings
        failOnError: true,
        // allow import cycles that include an asyncronous import,
        // e.g. via import(/* webpackMode: "weak" */ './file.js')
        allowAsyncCycles: false,
        // set the current working directory for displaying module paths
        cwd: process.cwd(),
      }),
      ...htmlWebpackPlugins,
      isEnvProduction && 
        new CopyPlugin({
          patterns: [
            {
              from: paths.appSrc,
              to: paths.appBuildLib,
              transform: {
                transformer: (input) => {
                  const str = input.toString('utf8'), regExp = /'@\/(.+)'/g;
                  return regExp[Symbol.replace](str, `'${path.join(paths.appBuildLib, '$1')}'`);
                }
              }
            }
          ],
        }),
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': paths.appSrc,
        '@test': paths.testPath
      }
    }
  }
}

function getEntrys (examples) {
  const entrys = {};
  examples.forEach(d => {
    const name = path.parse(d).name;
    entrys[name] = path.join(d, name)
  });

  return entrys;
}
