const jestqa = new JestQA(__filename, true)

afterEach(jestqa.afterEach)

const Locale = require('./index')

describe('#locale', () => {
  test('get the value from a nested object', () => {
    const result = Locale().get('service.init.success.welcome')
    expect(result).toBe('You have successfully installed RestQA! Let’s begin your test automation with RestQA 💥🚀')
  })

  test('get the value from a nested object using a prefix', () => {
    const result = Locale('service.init').get('success.welcome')
    expect(result).toBe('You have successfully installed RestQA! Let’s begin your test automation with RestQA 💥🚀')
  })

  test('get undefined if the key is not found', () => {
    const instance = Locale()
    let result = instance.get('bin.init.success.welcomeorNot')
    expect(result).toBeUndefined()

    result = instance.get('bin.installOups.success.welcomeorNot')
    expect(result).toBeUndefined()
  })
})
