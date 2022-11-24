beforeEach(() => {
  jest.resetModules()
})

describe('#Channel - Confluence', () => {
  test('throw error if the options are not valid', () => {
    const Confluence = require('./confluence')
    expect(() => {
      const options = {
        channel: 'foo'
      }
      new Confluence(options) // eslint-disable-line no-new
    }).toThrow(new Error('"url" is required'))
  })

  describe('get', () => {
    test('throw error if content is null', () => {
      const got = require('got')
      jest.mock('got')
      got.mockResolvedValue({
        body: {
          results: []
        }
      })
      const Confluence = require('./confluence')
      const options = {
        url: 'http://www.test.local',
        space_key: 'mySpace',
        auth: {
          username: 'foo',
          password: 'bar'
        }
      }
      const data = new Confluence(options)
      expect(data.get('users', 1)).rejects.toThrow(new Error('The dataset with the page title \'Dataset users\' doesn\'t exist in confluence \'mySpace\' space'))
      expect(got.mock.calls.length).toBe(1)

      const expectedOptions = {
        prefixUrl: 'http://www.test.local',
        searchParams: {
          expand: 'body.view',
          title: 'Dataset users',
          space: 'mySpace'
        },
        username: 'foo',
        password: 'bar',
        responseType: 'json'
      }
      expect(got.mock.calls[0][0]).toEqual('rest/api/content')
      expect(got.mock.calls[0][1]).toEqual(expectedOptions)
    })

    test('throw error if the row is not found', () => {
      const got = require('got')
      jest.mock('got')
      got.mockResolvedValue({
        body: {
          results: [{
            body: {
              view: {
                value: '<table><tr><td>foo</td></tr><tr><td>bar</td></tr></table>'
              }
            }
          }]
        }
      })
      const Confluence = require('./confluence')
      const options = {
        url: 'http://www.test.local',
        space_key: 'mySpace',
        auth: {
          username: 'foo',
          password: 'bar'
        },
        prefix_title: 'hello'
      }
      const data = new Confluence(options)
      expect(data.get('users', 2)).rejects.toThrow(new Error('Row not found'))
      expect(got.mock.calls.length).toBe(1)

      const expectedOptions = {
        prefixUrl: 'http://www.test.local',
        searchParams: {
          expand: 'body.view',
          title: 'hello users',
          space: 'mySpace'
        },
        username: 'foo',
        password: 'bar',
        responseType: 'json'
      }
      expect(got.mock.calls[0][0]).toEqual('rest/api/content')
      expect(got.mock.calls[0][1]).toEqual(expectedOptions)
    })

    test('throw error if the row is not found', () => {
      const got = require('got')
      jest.mock('got')
      got.mockResolvedValue({
        body: {
          results: [{
            body: {
              view: {
                value: '<table><tr><td>foo</td></tr><tr><td>bar</td></tr></table>'
              }
            }
          }]
        }
      })
      const Confluence = require('./confluence')
      const options = {
        url: 'http://www.test.local',
        space_key: 'mySpace',
        auth: {
          username: 'user',
          password: 'pass'
        },
        prefix_title: 'hello'
      }
      const data = new Confluence(options)
      expect(data.get('users', 1)).resolves.toEqual({ foo: 'bar' })
      expect(got.mock.calls.length).toBe(1)

      const expectedOptions = {
        prefixUrl: 'http://www.test.local',
        searchParams: {
          expand: 'body.view',
          title: 'hello users',
          space: 'mySpace'
        },
        username: 'user',
        password: 'pass',
        responseType: 'json'
      }
      expect(got.mock.calls[0][0]).toEqual('rest/api/content')
      expect(got.mock.calls[0][1]).toEqual(expectedOptions)
    })
  })
})
