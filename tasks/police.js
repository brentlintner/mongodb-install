var
  path = require('path'),
  police = path.join(__dirname, '..', 'node_modules', '.bin', 'police')

module.exports = function () {
  // TODO: re-compile on changes
  jake.exec([
    police + ' -l package.json'
  ], {
    printStdout: true,
    printStderr: true
  }, complete)
}
