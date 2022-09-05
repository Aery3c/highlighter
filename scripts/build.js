'use strict';

const webpack = require('webpack');
const configFactory = require('./config/webpack.config');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const chalk = require('chalk');

const config = configFactory('production');

function build () {
  console.log('Creating an optimized production build...');

  const compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      let messages;
      if (err) {
        if (!err.message) {
          return reject(err);
        }

        let errMessage = err.message;

        // Add additional information for postcss errors
        if (Object.prototype.hasOwnProperty.call(err, 'postcssNode')) {
          errMessage +=
            '\nCompileError: Begins at CSS selector ' +
            err['postcssNode'].selector;
        }

        messages = formatWebpackMessages({
          errors: [errMessage],
          warnings: [],
        });
      } else {
        messages = formatWebpackMessages(
          stats.toJson({ all: false, warnings: true, errors: true })
        );
      }
      if (messages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }
        return reject(new Error(messages.errors.join('\n\n')));
      }
      if (
        process.env.CI &&
        (typeof process.env.CI !== 'string' ||
          process.env.CI.toLowerCase() !== 'false') &&
        messages.warnings.length
      ) {
        // Ignore sourcemap warnings in CI builds. See #8227 for more info.
        const filteredWarnings = messages.warnings.filter(
          w => !/Failed to parse source map/.test(w)
        );
        if (filteredWarnings.length) {
          console.log(
            chalk.yellow(
              '\nTreating warnings as errors because process.env.CI = true.\n' +
              'Most CI servers set it automatically.\n'
            )
          );
          return reject(new Error(filteredWarnings.join('\n\n')));
        }
      }

      const resolveArgs = {
        stats,
        // previousFileSizes,
        warnings: messages.warnings,
      };

      // if (writeStatsJson) {
      //   return bfj
      //     .write(paths.appBuild + '/bundle-stats.json', stats.toJson())
      //     .then(() => resolve(resolveArgs))
      //     .catch(error => reject(new Error(error)));
      // }

      return resolve(resolveArgs);
    });
  });
}

build().catch(error => console.log(error));
