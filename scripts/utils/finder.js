const fs = require('fs');
const path = require('path');

/**
 *
 * @param {string} directoryPath
 * @param {string} type
 * @return {string[]}
 */
function finder (directoryPath, type) {
  let results = [];
  let files = fs.readdirSync(directoryPath);
  files.forEach(function(filename) {
    let filepath = path.join(directoryPath, filename);
    const stats = fs.statSync(filepath);
    if (stats.isDirectory()) {
      results.push(...finder(filepath, type));
    }
    if (stats.isFile() && new RegExp(`.${type}$`).test(filepath)) {
      results.push(filepath);
    }
  });

  return results;
}

module.exports = finder;
