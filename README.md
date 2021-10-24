# jq-wasm

A revamped version of [jq-web](https://github.com/fiatjaf/jq-web), the Javascript/WebAssembly build of [jq](https://github.com/stedolan/jq) 

- Bump JQ version to 1.6 
- Bump emcc version to 2.0.25
- Refactor client API
- Typescript support
- Performance improvements

## Quickstart

```js
var newJQ = require('jq-wasm')
const jq = await newJQ()
const output = await jq.invoke('{"jq": {"is": "awesome"}}', ".jq.is")
// "awesome"
```

## Installation

The easiest way is to download the build output directly from the [releases page](https://github.com/paolosimone/jq-wasm/releases):

| File                 | Description                                                        | 
|----------------------|--------------------------------------------------------------------|
| jq.wasm.js           | Javascript interface for interacting with JQ                       | 
| jq.wasm.min.js       | Same as jq.wasm.js, but minified                                   |
| jq.wasm              | JQ WebAssembly binary, loaded by jq.wasm.js and jq.wasm.min.js     |
| jq.wasm.d.ts         | Typescript types definition                                        | 


## Reference

#### `newJQ(module?): Promise<JQ>`

Return a promise that resolves into a JQ instance after the WebAssembly runtime has been initialized.  

It accepts an optional module object to overwrite emscripten default parameters.  
_Example:_ customize the path of the wasm file with `newJQ({locateFile: () => "path/to/jq.wasm"})`

For a complete list of available options, see the [emscripten official documentation](https://emscripten.org/docs/api_reference/module.html)


#### `jq.invoke(input, filter, options): Promise<string>`

Run jq and return the content of stdout on success.  
It's equivalent to `echo <input> | jq <options> <filter>`

## Build

1. [Install Emscripten from source](https://kripken.github.io/emscripten-site/docs/tools_reference/emsdk.html)
1. Clone `jq-wasm` and `cd` into it
1. Look over the `Makefile` for more Emscripten instructions
1. `make` (...and go grab a coffe while you wait)

## Known issues

#### Error when loading `.wasm` files

By default projects compiled with Emscripten look for `.wasm` files in the same directory that the `.js` file is run from. This causes issues when using webpack because name of the `.wasm` file is altered with a hash and can be placed in a different directory. To fix this problem you can use the [copy-webpack-plugin](https://github.com/webpack-contrib/copy-webpack-plugin) to copy the `jq.wasm` file to the same directory that the webpack bundle is placed.

#### Error when invoking more than once in the browser

The JQ instance in theory can be used more than once. For some yet unknown reason this is not the case when running JQ **in the browser**. The solution at the moment is to create a new instance each time you need it: `newJQ({noExitRuntime: false})`
