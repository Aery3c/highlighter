const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
  appPath: resolveApp('.'),
  appBuild: resolveApp('build'),
  appIndexJs: resolveApp('src/index'),
  appSrc: resolveApp('src'),
  exampleDir: resolveApp('example'),
  templateDir: resolveApp('template'),
  yarnLockFile: resolveApp('yarn.lock'),
  appPackageJson: resolveApp('package.json'),
  eslintPath: resolveApp('.eslintrc.js'),
  testPath: resolveApp('__tests__')
}
