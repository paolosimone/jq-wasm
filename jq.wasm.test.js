const initJQ = require('./dist/jq.wasm.js')


describe('raw', () => {
  test('simple', async () => {
    const jq = await initJQ()
    const result = await jq.raw('["a", {"12": "üñìçôdẽ"}]', '.[1]["12"] | {"what?": .}')
    expect(result).toBe(`{\n  "what?": "üñìçôdẽ"\n}`)
  })

  test('multiple call', async () => {
    const jq = await initJQ()

    var result = await jq.raw('["a", {"12": "üñìçôdẽ"}]', '.[1]["12"] | {"what?": .}')
    expect(result).toBe(`{\n  "what?": "üñìçôdẽ"\n}`)

    result = await jq.raw('["a", {"12": "üñìçôdẽ"}]', '.[1]["12"] | {"what?": .}')
    expect(result).toBe(`{\n  "what?": "üñìçôdẽ"\n}`)

    result = await jq.raw('["a", {"12": "üñìçôdẽ"}]', '.[1]["12"] | {"what?": .}')
    expect(result).toBe(`{\n  "what?": "üñìçôdẽ"\n}`)
  })  
})

describe('json', () => {
  test('simple', async () => {
    const jq = await initJQ()
    const result = jq.json({data: {message: 'This is an emoji test 🙏'}}, '.data')
    expect(result).toEqual({message: 'This is an emoji test 🙏'})
  })
})