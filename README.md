# jq-wasm

A fork of [jq-web](https://github.com/fiatjaf/jq-web), the WebAssembly build of [jq](https://github.com/stedolan/jq).

I forked the main project to have more control over the build process and the API interface, since it's a core component of [Virtual Json Viewer](https://github.com/paolosimone/virtual-json-viewer) browser extension.

**Highlights**

- `jq` version 1.7.1 
- `emcc` version 4.0.7
- Straightforward client API
- Typescript support
- Docker toolchain setup
- No Git submodules

## Quickstart

```js
var newJQ = require('jq-wasm')
const jq = await newJQ()
const output = await jq.invoke('{"jq": {"is": "awesome"}}', ".jq.is")
// "awesome"
```
## Installation

The easiest way is to download the build output directly from the [releases page](https://github.com/paolosimone/jq-wasm/releases):

| File                 | Description                                   | 
|----------------------|-----------------------------------------------|
| jq.wasm.js           | Javascript interface for interacting with JQ  | 
| jq.wasm              | JQ WebAssembly binary, loaded by jq.wasm.js   |
| jq.wasm.d.ts         | Typescript types definition                   | 

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

Make sure you have [Docker](https://www.docker.com/) installed and then simply

```bash
docker compose run --rm emsdk make
```

Output files will be in `dist` folder.

### Yarn

It's suggested to also have [Yarn](https://yarnpkg.com/) installed, 
in order to run tests and make sure everything works as expected

```bash
# shorter alias for building jq through docker
yarn make

# run smoke tests with Javascript
yarn test
```

## Known issues

#### Error when invoking more than once in the browser

The JQ instance in theory can be used more than once. 
For some unknown reason this is not the case when running JQ **in the browser**. 
The solution at the moment is to create a new instance each time you need it: `newJQ({noExitRuntime: false})`
