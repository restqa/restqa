afterEach(() => {
  jest.resetModules()
})

const Locale = require('./index')()

describe('#locale', () => {
  test('get the value from a nested object', () => {
    const result = Locale.get('bin.init.success.welcome')
    expect(result).toBe('Welcome to the Restqa community')
  })

  test('get undefined if the pkey is not found', () => {
    let result = Locale.get('bin.init.success.welcomeorNot')
    expect(result).toBeUndefined()

    result = Locale.get('bin.installOups.success.welcomeorNot')
    expect(result).toBeUndefined()
  })
})
