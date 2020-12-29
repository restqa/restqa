afterEach(() => {
    jest.resetModules()
})


describe('# Index - Generate', () => {
    test('Throw an error if the command is not a curl command', () => {
      const { Generate } = require('./index')
      const cmd = 'ls -lah'
      expect(Generate(cmd)).rejects.toThrow('You need to provide a curl command for me to generate an awesome scenario')
    })

    test('Throw an error if the command is not a curl command', () => {
      const mockGenerate = jest.fn().mockResolvedValue('result')
      jest.mock('./cli/generate', () => {
        return mockGenerate
      })

      const { Generate } = require('./index')
      const cmd = 'curl https://jsonplaceholder.typicode.com/todos/1'
      expect(Generate(cmd)).resolves.toEqual('result')
      expect(mockGenerate.mock.calls.length).toBe(1)
      const expectedOption = {
        args: [
          'curl',
          'https://jsonplaceholder.typicode.com/todos/1'
        ]
      }
      expect(mockGenerate.mock.calls[0][0]).toEqual(expectedOption)
      expect(mockGenerate.mock.calls[0][1]).toBe(false)
    })

    test('Curl command with a lot of options', () => {
      const mockGenerate = jest.fn().mockResolvedValue('result')
      jest.mock('./cli/generate', () => {
        return mockGenerate
      })

      const { Generate } = require('./index')
      const cmd = 'curl --url https://example/send --header "content-type: application/x-www-form-urlencoded" --cookie "JSESSIONID=B28CABC3FA3059E10CDE5201105D90F1" -d "ACCOUNT=@ccount" --data "PASSWORD=THIS_IS_PASS" --data-raw "MOBILE=09876463" --data "MESSAGE=test-sms"'

      expect(Generate(cmd)).resolves.toEqual('result')
      expect(mockGenerate.mock.calls.length).toBe(1)
      const expectedOption = {
        args: [
          'curl',
          '--url',
          'https://example/send',
          '--header',
          'content-type: application/x-www-form-urlencoded',
          '--cookie',
          'JSESSIONID=B28CABC3FA3059E10CDE5201105D90F1',
          '-d',
          'ACCOUNT=@ccount',
          '--data',
          'PASSWORD=THIS_IS_PASS',
          '--data-raw',
          'MOBILE=09876463',
          '--data',
          'MESSAGE=test-sms'
        ]
      }
      expect(mockGenerate.mock.calls[0][0]).toEqual(expectedOption)
      expect(mockGenerate.mock.calls[0][1]).toBe(false)
    })
})

