var
  path = require('path'),
  child_process = require('child_process'),
  express = require('express'),
  istanbul = path.join(__dirname, "..", "..", "node_modules", ".bin", "istanbul"),
  lcov_report = path.join(__dirname, "..", "..", "coverage", "lcov-report"),
  port = 4002

require('colors')

function test_with_cov() {
  var args = "cover -x **/tasks/** jake -- test".split(" ")

  child_process
    .spawn(istanbul, args, {stdio: "inherit"})
    .on("exit", function () {
      express()
        .use(express.static(lcov_report))
        .listen(port)

      console.log()
      console.log("lcov".green + " report ready.")
      console.log("  listening on: " + ("http://localhost:" + port).green)
    })
}

module.exports = test_with_cov
