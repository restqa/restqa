beforeEach(() => {
  global.console = {
    log: jest.fn()
  }
})

afterEach(() => {
  jest.resetModules()
})

const chalk = require('chalk')

describe('# utils - logger', () => {
  test('Share a welcome message if the flag is set to true and 1 message is passed', () => {
    const Welcome = require('./welcome')

    const config = {
      enabled: true,
      messages: [
        chalk.bold.green('Hello my friend')
      ]
    }
    Welcome(config)

    expect(global.console.log.mock.calls).toHaveLength(1)
    expect(global.console.log.mock.calls[0][0]).toEqual(chalk.bold.green('Hello my friend'))
  })

  test('Share a random welcome message if the flag is set to true and multiple message is passed', () => {
    const Welcome = require('./welcome')

    const config = {
      enabled: true,
      messages: Array(1000).fill(0).map((_, i) => {
        return chalk.bold.green(`Hello my friend ${i}`)
      })
    }

    Welcome(config) // First call
    Welcome(config) // Second call to test randomnes Normally, the result should be different

    expect(global.console.log.mock.calls).toHaveLength(2)

    const result1 = global.console.log.mock.calls[0][0]
    const result2 = global.console.log.mock.calls[1][0]

    expect(config.messages).toEqual(expect.arrayContaining([result1]))
    expect(config.messages).toEqual(expect.arrayContaining([result2]))

    expect(result1).not.toEqual(result2) // The first result should be different to the second result in order to validate the randomness
  })

  test('Do not  Share a welcome message if the flag is set to false', () => {
    const Welcome = require('./welcome')

    const config = {
      enabled: false,
      messages: [
        chalk.bold.green('Hello my friend')
      ]
    }
    Welcome(config)

    expect(global.console.log.mock.calls).toHaveLength(0)
  })

  test('Share the default Messages if no messages has been passed into the config', () => {
    const Welcome = require('./welcome')

    const config = {
      enabled: true
    }
    Welcome(config)

    expect(global.console.log.mock.calls).toHaveLength(1)
    expect(global.console.log.mock.calls[0][0]).not.toBeUndefined()
  })

  test('Share the default Messages if messages passed are empty into the config', () => {
    const Welcome = require('./welcome')

    const config = {
      enabled: true,
      message: []
    }
    Welcome(config)

    expect(global.console.log.mock.calls).toHaveLength(1)
    expect(global.console.log.mock.calls[0][0]).not.toBeUndefined()
  })

  test('Share the default Messages no config is passed', () => {
    const Welcome = require('./welcome')

    Welcome()

    expect(global.console.log.mock.calls).toHaveLength(1)
    expect(global.console.log.mock.calls[0][0]).not.toBeUndefined()
  })
})
