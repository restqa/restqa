beforeEach(() => {
  jest.resetModules()
})

describe('#Services - data', () => {
  test('Module type ', () => {
    const data = require('./index')
    expect(typeof data).toEqual('function')
  })

  test('Available methods when the channel is not defined into the options', () => {
    const data = require('./index')()
    expect(Object.keys(data)).toEqual(['storage'])
  })

  test('GetStorage', () => {
    const Storage = require('./storages')
    jest.mock('./storages')
    const opt = { storage: '/data' }
    require('./index')(opt)
    expect(Storage.mock.calls.length).toBe(1)
    expect(Storage.mock.calls[0][0]).toEqual(opt)
  })

  describe('GetChannel', () => {
    test('throw error if the channel doesnt\'t exist', () => {
      const data = require('./index')
      expect(() => {
        const options = {
          channel: 'foo'
        }
        data(options)
      }).toThrow(new Error('The channel "foo" doesn\'t exist. Available : google-sheet, confluence, csv'))
    })

    test('Success - call channel function', () => {
      const Channels = require('./channels')
      jest.mock('./channels')

      Channels['foo-bar'] = jest.fn()

      const data = require('./index')
      const options = {
        channel: 'foo-bar',
        config: {
          key: 'users'
        }
      }
      data(options)

      expect(Channels['foo-bar'].mock.calls.length).toBe(1)
      expect(Channels['foo-bar'].mock.calls[0][0]).toEqual({ key: 'users' })
    })
  })
})
