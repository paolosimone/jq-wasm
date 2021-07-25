// necessary because the default emscriptem exit() logs a lot of text.
function exit() {}

// takes a string as input and returns a string
// like `echo <jsonstring> | jq <filter>`, returning the value of STDOUT
function raw(jsonstring, filter, flags) {
  stdin = jsonstring
  inBuffer = []
  outBuffer = []
  errBuffer = []

  flags = flags || []
  callMain(flags.concat(filter))

  // calling main closes stdout, so we reopen it here:
  FS.streams[1] = FS.open('/dev/stdout', 577, 0)
  FS.streams[2] = FS.open('/dev/stderr', 577, 0)

  if (outBuffer.length) {
    return fromByteArray(outBuffer).trim()
  }

  if (errBuffer.length) {
    var errBufferContents = fromByteArray(errBuffer)
    var errString = errBufferContents
    if (errString.indexOf(':') > -1) {
      var parts = errString.split(':')
      errString = parts[parts.length - 1].trim()
    }
    var err = new Error(errString)
    err.stack = errBufferContents
    throw err
  }

  return ''
}

// takes an object as input and tries to return objects.
function json(json, filter) {
  var jsonstring = JSON.stringify(json)
  var result = raw(jsonstring, filter, ['-c']).trim()

  if (result.indexOf('\n') !== -1) {
    return result
      .split('\n')
      .filter(line => line)
      .flatMap(line => JSON.parse(line))
  } 

  return JSON.parse(result)
}

Module.json = json
Module.raw = raw