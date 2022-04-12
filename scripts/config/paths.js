const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
  appPath: resolveApp('.'),
  appBuild: resolveApp('build'),
  appIndexJs: resolveApp('src/index'),
  appSrc: resolveApp('src'),
  templateDir: resolveApp('template')
}

