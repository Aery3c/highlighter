'use strict'

const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
  yarnLockFile: resolveApp('yarn.lock'),
  appPackageJson: resolveApp('package.json'),
  dist: resolveApp('./dist'),
  examples: resolveApp('./examples'),
}