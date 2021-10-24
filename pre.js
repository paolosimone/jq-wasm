// load a string and emit one byte at a time
var InputBuffer = function() {
  var module = {}

  var bytes = []
  var cursor = 0

  module.load = function(text) {
    bytes = new TextEncoder().encode(text)
    cursor = 0
  }

  module.next = function() {
    return cursor < bytes.length ? bytes[cursor++] : null
  }

  return module
}

// receive a byte at a time and convert the result to a string
var OutputBuffer = function() {
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

// I/O buffers are initialized only once, so
// we need to keep the same instance between consecutive runs
var stdin = InputBuffer()
var stdout = OutputBuffer()
var stderr = OutputBuffer()

// initialize I/O buffers 
Module["preRun"] = function() {
  FS.init(stdin.next, stdout.push, stderr.push)
}

// invoke the jq command like in terminal
// echo {jsonString} | jq {options} {filter}
Module["invoke"] = function(jsonString, filter, options = []) {
  return new Promise(function (resolve, reject) {
    try {
      stdin.load(jsonString)
      callMain(options.concat(filter))

      if (EXITSTATUS) {
        reject(new Error(stderr.toString()))
      } else {
        resolve(stdout.toString())
      }
    } catch (e) {
      reject(e)
    } finally {
      stdin.load("")
      stdout.flush()
      stderr.flush()
    }
  })
}

// prevent running main at startup
Module["noInitialRun"] = true

// allows multiple calls to main. Default: true
if (!Module.hasOwnProperty("noExitRuntime")) {
  Module["noExitRuntime"] = true
}