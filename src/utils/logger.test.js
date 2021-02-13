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
  function _eq(expected, received) {
    expected = Buffer.from(expected).toString('base64')
    received = Buffer.from(received).toString('base64')
    expect(expected).toEqual(received)
  }

  test('log error', () => {
    const logger = require('./logger') 
    logger.error('my error msg', 'msg2')
    expect(global.console.log.mock.calls.length).toBe(1)
    expect(global.console.log.mock.calls[0][0]).toEqual(chalk.bold.red('my error msg msg2'))
  })

  test('log info', () => {
    const logger = require('./logger') 
    logger.info('my info msg', 'msg2')
    expect(global.console.log.mock.calls.length).toBe(1)
    expect(global.console.log.mock.calls[0][0]).toEqual(chalk.bold.blue('my info msg msg2'))
  })

  test('log log', () => {
    const logger = require('./logger') 
    logger.log('my msg', 'msg2')
    expect(global.console.log.mock.calls.length).toBe(1)
    expect(global.console.log.mock.calls[0][0]).toEqual('my msg')
    expect(global.console.log.mock.calls[0][1]).toEqual('msg2')
  })

  test('log success', () => {
    const logger = require('./logger') 
    logger.success('my success msg', 'msg2')
    expect(global.console.log.mock.calls.length).toBe(1)
    expect(global.console.log.mock.calls[0][0]).toEqual(chalk.bold.green('my success msg msg2'))
  })

  test('log warning', () => {
    const logger = require('./logger') 
    logger.warning('my warning msg', 'msg2')
    expect(global.console.log.mock.calls.length).toBe(1)
    expect(global.console.log.mock.calls[0][0]).toEqual(chalk.bold.yellow('my warning msg msg2'))
  })
})
