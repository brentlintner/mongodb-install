var
  optimist = require('optimist'),
  help = require('./cli/help')

function interpret() {
  var
    argv = optimist.argv,
    cmd = argv._.length > 0 ? argv._[0] : 'install',
    subcmd = argv._.length > 1 ? argv._[1] : undefined

  try {
    if (cmd == 'help') {
      help['default'](subcmd)
    } else {
      require('./cli/' + cmd)[subcmd || 'default'](argv)
    }
  } catch(e) {
    console.error('Something BAD happened.')
    console.error(e)
  }
}

module.exports = {
  interpret: interpret
}
