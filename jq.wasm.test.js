const newJQ = require('./dist/jq.wasm.js')

test('version', async () => {
  const jq = await newJQ()
  const version = await jq.invoke('', '--version')
  expect(version.startsWith("jq-1.6")).toBeTruthy()
})

test('multiple call', async () => {
  const jq = await newJQ()

  var result = await jq.invoke('["a", {"12": "üñìçôdẽ"}]', '.[1]["12"] | {"what?": .}')
  expect(result).toBe(`{\n  "what?": "üñìçôdẽ"\n}`)

  result = await jq.invoke('["a", {"12": "üñìçôdẽ"}]', '.[1]["12"] | {"what?": .}')
  expect(result).toBe(`{\n  "what?": "üñìçôdẽ"\n}`)

  result = await jq.invoke('["a", {"12": "üñìçôdẽ"}]', '.[1]["12"] | {"what?": .}')
  expect(result).toBe(`{\n  "what?": "üñìçôdẽ"\n}`)
})  

// TODO more complex tests
// TODO performance tests?
// TODO test errors