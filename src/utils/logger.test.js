beforeEach(() => {
  global.console = {
    log: jest.fn()
  }
})

afterEach(() => {
  jest.resetModules()
})


describe('# utils - logger', () => {
  test('log error', () => {
    const logger = require('./logger') 
    logger.error('my error msg', 'msg2')
    expect(global.console.log.mock.calls.length).toBe(1)
    expect(global.console.log.mock.calls[0][0]).toEqual('[1m[31mmy error msg msg2[39m[22m')
  })

  test('log info', () => {
    const logger = require('./logger') 
    logger.info('my info msg', 'msg2')
    expect(global.console.log.mock.calls.length).toBe(1)
    expect(global.console.log.mock.calls[0][0]).toEqual('[1m[34mmy info msg msg2[39m[22m')
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
    expect(global.console.log.mock.calls[0][0]).toEqual('[1m[32mmy success msg msg2[39m[22m')
  })
})
