const path = require('path')
const Swagger = require('../index.js')

describe('swagger', () => {

  const fixtures = [
    'fixture-1',
  ].map(folder => path.resolve(__dirname, folder))

  test.each(fixtures)(`convert api into a swagger definfition: %s`, (folder) => {
    // Preparation
    const apis = require(path.resolve(folder, 'api-list.json'))
    const expectedFixture = require(path.resolve(folder, 'expect.swagger.json'))
    const options = require(path.resolve(folder, 'options.js'))


    const instance = new Swagger(options.toJSON())

    apis.forEach(api => {
      instance.add(api)
    })

    const result = instance.format()

    // Assertion
    expect(result).toEqual(expectedFixture)
  })
})

