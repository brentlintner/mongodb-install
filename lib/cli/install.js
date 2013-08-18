var
  install = require('./../install')

function fetch_file(opts) {
  install.fetch(opts, function () {})
}

module.exports = {
  default: fetch_file,
  fetch: fetch_file
}
