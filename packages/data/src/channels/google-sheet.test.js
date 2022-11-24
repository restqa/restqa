const { URLSearchParams } = require('url')

beforeEach(() => {
  jest.resetModules()
})

describe('#Channel - GoogleSheets', () => {
  test('throw error if the options are not valid', () => {
    const Gsheet = require('./google-sheet')
    expect(() => {
      const options = {
        channel: 'foo'
      }
      new Gsheet(options) // eslint-disable-line no-new
    }).toThrow(new Error('"id" is required'))
  })

  describe('get', () => {
    test('throw error if content is null', () => {
      const got = require('got')
      jest.mock('got')
      got.mockResolvedValue({
        body: {
          valueRanges: [{
            values: []
          }, {
            values: []
          }]
        }
      })
      const Gsheet = require('./google-sheet')
      const options = {
        id: 'my-id',
        apikey: 'xxx-yyy-zzz'
      }
      const data = new Gsheet(options)
      expect(data.get('users', 1)).rejects.toThrow(new Error('The data at the row 1 doesn\'t exist'))
      expect(got.mock.calls.length).toBe(1)

      const expectedOptions = {
        prefixUrl: 'https://sheets.googleapis.com/v4/spreadsheets/my-id',
        searchParams: new URLSearchParams([
          ['key', 'xxx-yyy-zzz'],
          ['ranges', 'users!1:1'],
          ['ranges', 'users!1:1']
        ]),
        responseType: 'json'
      }
      expect(got.mock.calls[0][0]).toEqual('values:batchGet')
      expect(got.mock.calls[0][1]).toEqual(expectedOptions)
    })

    test('Return the expected row', () => {
      const got = require('got')
      jest.mock('got')
      got.mockResolvedValue({
        body: {
          valueRanges: [{
            values: [
              [
                'firstname',
                'lastname',
                'dateOfbith',
                'Gender',
                'full name'
              ]
            ]
          }, {
            values: [
              [
                'gina',
                'jean',
                '2005/12/01',
                'female',
                'gina jean'
              ]
            ]
          }]
        }
      })
      const Gsheet = require('./google-sheet')
      const options = {
        id: 'my-id',
        apikey: 'xxx-yyy-zzz'
      }
      const data = new Gsheet(options)
      const expectedResult = {
        firstname: 'gina',
        lastname: 'jean',
        dateOfbith: '2005/12/01',
        Gender: 'female',
        'full name': 'gina jean'
      }
      expect(data.get('users', 1)).resolves.toEqual(expectedResult)
      expect(got.mock.calls.length).toBe(1)

      const expectedOptions = {
        prefixUrl: 'https://sheets.googleapis.com/v4/spreadsheets/my-id',
        searchParams: new URLSearchParams([
          ['key', 'xxx-yyy-zzz'],
          ['ranges', 'users!1:1'],
          ['ranges', 'users!1:1']
        ]),
        responseType: 'json'
      }
      expect(got.mock.calls[0][0]).toEqual('values:batchGet')
      expect(got.mock.calls[0][1]).toEqual(expectedOptions)
    })
  })
})
