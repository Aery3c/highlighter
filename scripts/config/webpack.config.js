'use strict'

const paths = require('./paths');
const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin')

const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

module.exports = function (webpackEnv) {
  const isEnvDevelopment = webpackEnv === 'development';
  const isEnvProduction = webpackEnv === 'production';

  const plugins = [];
  const entry = {};
  entry['highlighter'] = {
    import: paths.appIndexJs,
    library: {
      name: 'Highlighter',
      type: 'umd',
      export: 'default',
    },
  }
  if (isEnvDevelopment) {
    const files = fs.readdirSync(paths.exampleDir);

    files.forEach(filename => {
      const fp = path.join(paths.exampleDir, filename);
      const stats = fs.statSync(fp);
      if (stats.isFile() && new RegExp(/\.js$/).test(filename) && filename !== 'highlighter.js') {
        const name = filename.split('.')[0];
        plugins.push(
          new HtmlWebpackPlugin({
            title: name,
            filename: `example/${name}.html`,
            template: path.join(paths.templateDir, 'index.html'),
            publicPath: '../',
            scriptLoading: 'blocking',
            inject: 'body',
            chunks: ['highlighter', 'init', 'menu', name]
          }),
        );
        entry[name] = fp;
      }
    });
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
      filename: isEnvProduction ? 'highlighter.js' : isEnvDevelopment && '[name].dev.js',
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
      ...plugins
    ],
    resolve: {
      alias: {
        '@': paths.appSrc
      }
    }
  }
}
