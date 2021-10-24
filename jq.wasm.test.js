const newJQ = require('./dist/jq.wasm.js')

test('version', async () => {
  const jq = await newJQ()
  const version = await jq.invoke('', '--version')
  expect(version.startsWith("jq-1.6")).toBeTruthy()
})

test('multiple calls', async () => {
  const jq = await newJQ()

  var result = await jq.invoke('["a", {"12": "üñìçôdẽ"}]', '.[1]["12"] | {"what?": .}', ["-e"])
  expect(result).toBe(`{\n  "what?": "üñìçôdẽ"\n}`)

  result = await jq.invoke('{"boolean": true,\n "int": 1}', '.boolean', ["-e"])
  expect(result).toBe(`true`)

  result = await jq.invoke('{"boolean": true, "int": 1}', '.int', ["-e"])
  expect(result).toBe(`1`)
})  
