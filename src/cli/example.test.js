const path = require('path')

const jestqa = new JestQA(__filename, true)
afterEach(jestqa.afterEach)

describe('# cli - example', () => {
  test('Run the example', async () => {
    const mockRun = jest.fn()
    jest.mock('./run', () => {
      return mockRun
    })

    const Example = require('./example')
    await Example()

    expect(mockRun.mock.calls).toHaveLength(1)
    const expectedOption = {
      args: [path.resolve(__dirname, '..', '..', 'example')]
    }
    expect(mockRun.mock.calls[0][0]).toEqual(expectedOption)
  })
})
