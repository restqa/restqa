const jestqa = new JestQA(__filename, true)

afterEach(jestqa.afterEach)

const Locale = require('./index')()

describe('#locale', () => {
  test('get the value from a nested object', () => {
    const result = Locale.get('service.init.success.welcome')
    expect(result).toBe('You have successfully installed RestQA! Let’s begin your test automation with RestQA 💥🚀')
  })

  test('get undefined if the key is not found', () => {
    let result = Locale.get('bin.init.success.welcomeorNot')
    expect(result).toBeUndefined()

    result = Locale.get('bin.installOups.success.welcomeorNot')
    expect(result).toBeUndefined()
  })
})
