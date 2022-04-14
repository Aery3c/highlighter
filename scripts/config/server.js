'use strict';

module.exports = function () {
  return {
    hot: true,
    compress: true,
    devMiddleware: {
      writeToDisk: true,
    },
    client: {
      progress: true
    }
  }
}
