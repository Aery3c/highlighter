'use strict'

const clearConsole = require('react-dev-utils/clearConsole');
const chalk = require('chalk');
const output = require('friendly-errors-webpack-plugin/src/output');

const isInteractive = process.stdout.isTTY;

function isMultiStats(stats) {
  return stats.stats;
}
function getCompileTime (stats) {
  if (isMultiStats(stats)) {
    // Webpack multi compilations run in parallel so using the longest duration.
    // https://webpack.github.io/docs/configuration.html#multiple-configurations
    return stats.stats
      .reduce((time, stats) => Math.max(time, getCompileTime(stats)), 0);
  }
  return stats.endTime - stats.startTime;
}
function printInstructions(appName, urls, useYarn) {
  console.log();
  console.log(`You can now view ${chalk.bold(appName + ' app example')} in the browser.`);
  console.log();

  if (urls.lanUrlForTerminal) {
    console.log(
      `  ${chalk.bold('Local:')}            ${urls.localUrlForTerminal}example`
    );
    console.log(
      `  ${chalk.bold('On Your Network:')}  ${urls.lanUrlForTerminal}example`
    );
  } else {
    console.log(`  ${urls.localUrlForTerminal}`);
  }

  console.log();
  console.log('Note that the development build is not optimized.');
  console.log(
    `To create a production build, use ` +
    `${chalk.cyan(`${useYarn ? 'yarn' : 'npm run'} build`)}.`
  );
  console.log();
}


function createCompiler ({ appName, config, urls, useYarn, webpack }) {

  const compiler = webpack(config);

  compiler.hooks.invalid.tap('invalid', () => {
    if (isInteractive) {
      clearConsole();
    }
    console.log('Compiling...');
  });

  compiler.hooks.done.tap('done', async stats => {
    if (isInteractive) {
      clearConsole();
    }

    const hasErrors = stats.hasErrors();
    const hasWarnings = stats.hasWarnings();

    const isSuccessful = !hasErrors && !hasWarnings;

    if (isSuccessful) {
      const time = getCompileTime(stats);
      output.title('success', 'DONE', 'Compiled successfully in ' + time + 'ms');
    }

    if (isSuccessful) {
      printInstructions(appName, urls, useYarn);
    }

    if (hasErrors) {
      output.title('error', 'ERROR', 'Failed to compile.\n');
      return;
    }

    if (hasWarnings) {
      output.title('warnings', 'WARNINGS', 'Compiled with warnings.\n');
      return;
    }

  });

  return compiler;
}

module.exports = createCompiler;
