var
  fs = require('fs'),
  path = require('path'),
  cli_doc = path.join(__dirname, '..', '..', 'doc', 'lib', 'cli')

function help(cmd) {
  var
    help_file = path.join(cli_doc, (cmd || 'help') + '.md')

  fs.readFile(help_file, 'utf-8', function (err, data) {
    if (err) {
      console.error(err)
      console.error('The help file for the specified command name may not exist.')
    } else {
      console.log(data)
    }
  })
}

module.exports = {
  default: help
}
