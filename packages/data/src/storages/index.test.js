beforeEach(() => {
  jest.resetModules()
})

describe('#Services - data', () => {
  test('Module type ', () => {
    const Storage = require('./index')
    expect(typeof Storage).toEqual('function')
  })

  test('Available methods when the channel is not defined into the options', () => {
    const opt = {
      logger: {
        log: jest.fn()
      }
    }
    const Storage = require('./index')(opt)
    expect(Object.keys(Storage)).toEqual(['get', 'set'])
    expect(opt.logger.log.mock.calls.length).toBe(1)
    expect(opt.logger.log.mock.calls[0][0]).toBe('[RESTQDATA] No storage found (default: /tmp/)')
  })

  describe('get', () => {
    test('Throw an error when the file is not found', () => {
      const fs = require('fs')
      jest.mock('fs')
      fs.existsSync = jest.fn().mockReturnValue(false)
      const Storage = require('./index')
      expect(() => {
        Storage().get('test.png')
      }).toThrow(new Error('[RESTQDATA] Impossible to load the file from the storage /tmp/test.png'))
      expect(fs.existsSync.mock.calls.length).toBe(1)
      expect(fs.existsSync.mock.calls[0][0]).toBe('/tmp/test.png')
    })

    test('Return the filename when the file is found', () => {
      const fs = require('fs')
      jest.mock('fs')
      fs.existsSync = jest.fn().mockReturnValue(true)
      const opt = {
        storage: 'data'
      }
      const Storage = require('./index')(opt)
      const result = Storage.get('test.png')
      const expectedPath = require('path').resolve('data', 'test.png')
      expect(result).toBe(expectedPath)
      expect(fs.existsSync.mock.calls.length).toBe(1)
      expect(fs.existsSync.mock.calls.length).toBe(1)
      expect(fs.existsSync.mock.calls[0][0]).toBe(expectedPath)
    })
  })

  describe('set', () => {
    test('Return the filename when the file is saved', () => {
      const fs = require('fs')
      jest.mock('fs')
      fs.writeFileSync = jest.fn().mockReturnValue(true)
      const opt = {
        storage: 'data'
      }
      const Storage = require('./index')(opt)
      const result = Storage.set('test.png', 'my custom base64')
      const expectedPath = require('path').resolve('data', 'test.png')
      expect(result).toBe(expectedPath)
      expect(fs.writeFileSync.mock.calls.length).toBe(1)
      expect(fs.writeFileSync.mock.calls[0][0]).toBe(expectedPath)
      expect(fs.writeFileSync.mock.calls[0][1]).toEqual(Buffer.from('my custom base64', 'base64'))
    })
  })
})
