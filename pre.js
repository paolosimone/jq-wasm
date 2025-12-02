// Receive a byte at a time and convert the result to a string
const OutputBuffer = function() {
  var module = {}

  var bytes = []

  module.flush = function() {
    bytes = []
  }

  module.push = function(char) {
    if (char) bytes.push(char)
  }

  module.toString = function() {
    return new TextDecoder().decode(new Uint8Array(bytes)).trim()
  }

  return module
}

// I/O buffers are initialized only once
// and reused acrosse consecutive runs.
// Stdin is not used as file is read directly from FS.
const stdinNext = () => {};
const stdout = OutputBuffer()
const stderr = OutputBuffer()

// Initialize I/O buffers.
Module["preRun"] = function() {
  FS.init(stdinNext, stdout.push, stderr.push)
}

// Invoke the jq command like in terminal
// echo {jsonString} > INPUT && jq {options} {filter} INPUT
const JQ_INPUT = "input.json";
function invokeJQ(jsonString, filter, options = []) {
  return new Promise(function(resolve, reject) {
    try {
      FS.writeFile(JQ_INPUT, jsonString)
      callMain(options.concat(filter, JQ_INPUT))
      if (EXITSTATUS) {
        reject(new Error(stderr.toString()))
      } else {
        resolve(stdout.toString())
      }
    } catch (e) {
      reject(e)
    } finally {
      FS.unlink(JQ_INPUT)
      stdout.flush()
      stderr.flush()
    }
  })
}

function jqVersion() {
  return invokeJQ('', '', ['--version'])
}

Module["invoke"] = invokeJQ
Module["version"] = jqVersion

// prevent running main at startup
Module["noInitialRun"] = true

// allows multiple calls to main. Default: true
if (!Module.hasOwnProperty("noExitRuntime")) {
  Module["noExitRuntime"] = true
}
