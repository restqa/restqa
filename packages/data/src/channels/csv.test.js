beforeEach(() => {
  jest.resetModules()
})

describe('#Channel - CSV', () => {
  test('throw error if the options are not valid', () => {
    const Csv = require('./csv')
    expect(() => {
      const options = {
        channel: 'foo'
      }
      new Csv(options) // eslint-disable-line no-new
    }).toThrow(new Error('"folder" is required'))
  })

  describe('get', () => {
    test('throw error if the expected row is lower or equal 1', () => {
      const fs = require('fs')
      jest.mock('fs')
      fs.existsSync.mockReturnValue(false)
      const Csv = require('./csv')
      const options = {
        folder: '/my-data',
        delimiter: ';'
      }

      const data = new Csv(options)
      expect(data.get('users', 0)).rejects.toThrow(new Error('There is not data on the row 0'))
      expect(data.get('users', 1)).rejects.toThrow(new Error('There is not data on the row 1'))
      expect(fs.existsSync.mock.calls.length).toBe(0)
    })

    test('throw error if the file doesn\'t exist', () => {
      const fs = require('fs')
      jest.mock('fs')
      fs.existsSync.mockReturnValue(false)
      const Csv = require('./csv')
      const options = {
        folder: '/my-data',
        delimiter: ';'
      }

      const data = new Csv(options)
      expect(data.get('users', 2)).rejects.toThrow(new Error('Impossible to load the dataset from the csv /my-data/users.csv'))
      expect(fs.existsSync.mock.calls.length).toBe(1)

      expect(fs.existsSync.mock.calls[0][0]).toEqual('/my-data/users.csv')
    })

    test('Throw error when row is not found', () => {
      const fs = require('fs')
      jest.mock('fs')
      fs.existsSync.mockReturnValue(true)
      const csvFileInput = `
firstname,lastname,dateOfbith,Gender,full name
gina,jean,2005/12/01,female,gina jean
john,doe,1990/12/02,male,john doe
`
      fs.readFileSync.mockReturnValue(csvFileInput)

      const Csv = require('./csv')

      const options = {
        folder: '/my-data'
      }

      const data = new Csv(options)
      expect(data.get('users', 4)).rejects.toThrow(new Error('The data set row 4 doesn\'t exist on the resource users.csv'))
      expect(fs.existsSync.mock.calls.length).toBe(1)
      expect(fs.existsSync.mock.calls[0][0]).toEqual('/my-data/users.csv')
      expect(fs.readFileSync.mock.calls.length).toBe(1)
      expect(fs.readFileSync.mock.calls[0][0]).toEqual('/my-data/users.csv')
    })

    test('Return the expected row', () => {
      const fs = require('fs')
      jest.mock('fs')
      fs.existsSync.mockReturnValue(true)
      const csvFileInput = `
firstname,lastname,dateOfbith,Gender,full name
gina,jean,2005/12/01,female,gina jean
john,doe,1990/12/02,male,john doe
`

      fs.readFileSync.mockReturnValue(csvFileInput)

      const parse = require('csv-parse/lib/sync')
      jest.mock('csv-parse/lib/sync')
      parse.mockReturnValue([{
        firstname: 'gina',
        lastname: 'jean',
        dateOfbith: '2005/12/01',
        Gender: 'female',
        'full name': 'gina jean'
      }])

      const Csv = require('./csv')

      const options = {
        folder: '/my-data',
        delimiter: ','
      }

      const data = new Csv(options)
      const expectedResult = {
        firstname: 'gina',
        lastname: 'jean',
        dateOfbith: '2005/12/01',
        Gender: 'female',
        'full name': 'gina jean'
      }
      expect(data.get('users', 2)).resolves.toEqual(expectedResult)
      expect(fs.existsSync.mock.calls.length).toBe(1)
      expect(fs.existsSync.mock.calls[0][0]).toEqual('/my-data/users.csv')
      expect(fs.readFileSync.mock.calls.length).toBe(1)
      expect(fs.readFileSync.mock.calls[0][0]).toEqual('/my-data/users.csv')
      expect(parse.mock.calls.length).toEqual(1)
      const expectedParseOption = {
        delimiter: ',',
        columns: true,
        skip_empty_lines: true,
        from: 1,
        to: 1
      }
      expect(parse.mock.calls[0][0]).toEqual(csvFileInput)
      expect(parse.mock.calls[0][1]).toEqual(expectedParseOption)
    })
  })
})
