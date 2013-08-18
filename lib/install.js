var
  path = require('path'),
  child_process = require('child_process'),
  fs = require('fs'),
  shell = require('shelljs'),
  unzip = require('unzip'),
  request = require('request'),
  mod_progbar = require('progbar'),

  download_server = 'http://fastdl.mongodb.org',

  dirs = {
    installed: path.join(__dirname, '..', 'installed'),
  }

require('colors')

function generate_path(opts) {
  var
    sys = process.platform,

    version = opts.r || opts.release,

    arch = opts.arch || opts.a ||
           (process.arch.match('x64') ?
             'x86_64' :
             'i686'
           ),

    os = opts.os || opts.o ||
            (sys.match(/^win/) ?
              'win32' :
              (sys.match(/darwin/) ?
                'osx' :
                (sys.match(/solaris|sunos/) ?
                  'sunos5' :
                  'linux'
            ))),

    archive = os.match(/^win/) ? 'zip' : 'tgz'

  if (!version) throw "You need to specific '--install [version]'."

  // win32 has different name for x32 bit download
  if (arch == 'i686' && os == 'win32') arch = 'i386'

  return os + '/mongodb-' + os + '-' + arch + '-' + version + "." + archive
}

function extract(filepath, dest, done) {
  var output_folder = path.join(dest, path.basename(filepath).replace(/\.[^\.]*$/, ''))

  function finish() {
    console.log('INFO'.green + ' Add to you PATH:')
    console.log('  ' + path.join(output_folder, 'bin'))
    done()
  }

  console.log('INFO'.green + ' in: ' +  dest)

  if (filepath.match(/\.zip/)) {
    fs.createReadStream(filepath)
      .on("error", function (err) { throw err })
      .on('end', finish)
      .pipe(unzip.Extract({ path: dest }))
  } else {
    child_process.exec('tar -xvf ' + filepath + ' -C ' + dest,
      function (err, stdout, stderr) {
        console.log(stdout)
        console.log(stderr)
        if (err) throw err
        finish()
      })
  }
}

function fetch_file(opts, done) {
  if (!opts) opts = {}

  var
    dest = opts.to || opts.t || dirs.installed,
    filename = generate_path(opts),
    filepath = path.join(dest, path.basename(filename)),
    url = download_server + '/' + filename

  if (!fs.existsSync(dest)) {
    console.log('INFO'.gren + ' Creating destination folder: ' + dest)
    shell.mkdir(dest)
  }

  if (fs.existsSync(filepath)) {
    extract(filepath, dest, done)
  } else {
    console.log('INFO'.green + ' Downloading: ' + url)

    var req = request(url)

    req.on('response', function (res) {
      var bar = new mod_progbar.ProgressBar({
        filename: path.basename(filename),
        size: parseInt(res.headers['content-length'], 10)
      })

      req.on('data', function (data) {
        bar.advance(data.length)
      })

      req.on('end', function (/*data*/) {
        bar.end()
        extract(filepath, dest, done)
      })
    })

    req.pipe(fs.createWriteStream(filepath))
  }
}

module.exports = {
  fetch: fetch_file
}
