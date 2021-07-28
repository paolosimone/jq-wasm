// TODO comments

var InputStream = function() {
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

var OutputStream = function() {
  var module = {}

  var bytes = []

  module.flush = function() {
    bytes = []
  }

  module.read = function(char) {
    if (char) bytes.push(char)
  }

  module.toString = function() {
    return new TextDecoder().decode(new Uint8Array(bytes)).trim()
  }

  return module
}

var stdin = InputStream()
var stdout = OutputStream()
var stderr = OutputStream()

Module["preRun"] = function() {
  FS.init(stdin.next, stdout.read, stderr.read)
}

// TODO promise
Module["invoke"] = function(jsonString, filter, options = []) {
  stdin.load(jsonString)
  stdout.flush()
  stderr.flush()

  callMain(options.concat(filter))

  // TODO improve error handling
  return EXITSTATUS ? stderr.toString() : stdout.toString()
}

Module["noInitialRun"] = true
Module["noExitRuntime"] = true