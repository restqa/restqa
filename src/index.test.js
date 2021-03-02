afterEach(() => {
    jest.resetModules()
    jest.resetAllMocks()
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
        ],
        print: false
      }
      expect(mockGenerate.mock.calls[0][0]).toEqual(expectedOption)
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
        print: false,
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
    })
})

describe('# Index - Install', () => {
  test('Get result from an addon  Install', () => {
      const mockInstall = {
        generate: jest.fn().mockReturnValue('result')
      }

      jest.mock('./cli/install', () => {
        return mockInstall
      })

      const { Install } = require('./index')
      const opt = {
        name: 'slack',
        env: 'uat'
      }
      expect(Install(opt)).toEqual('result')
      expect(mockInstall.generate.mock.calls.length).toBe(1)
      expect(mockInstall.generate.mock.calls[0][0]).toEqual({
        name: 'slack',
        env: 'uat'
      })

  })
})

describe('# Index - Step', () => {
  test('Get result from Step defintions', () => {
      const mockSteps = jest.fn().mockReturnValue('result')

      jest.mock('./cli/steps', () => {
        return mockSteps
      })

      const opt = {
        configFile: '/tmp/.restqa.yml',
        keyword: 'then',
        tag: 'header'
      }

      const { Steps } = require('./index')
      expect(Steps(opt)).toEqual('result')
      expect(mockSteps.mock.calls.length).toBe(1)
      expect(mockSteps.mock.calls[0][0]).toEqual('then')
      expect(mockSteps.mock.calls[0][1]).toEqual({
        configFile: '/tmp/.restqa.yml',
        tag: 'header',
        print: false
      })
  })

  test('Get result from Step defintions (default value)', () => {
      const mockSteps = jest.fn().mockReturnValue('result')

      jest.mock('./cli/steps', () => {
        return mockSteps
      })

      const opt = {
        keyword: 'then',
        tag: 'header'
      }

      const { Steps } = require('./index')
      expect(Steps(opt)).toEqual('result')
      expect(mockSteps.mock.calls.length).toBe(1)
      expect(mockSteps.mock.calls[0][0]).toEqual('then')
      expect(mockSteps.mock.calls[0][1]).toEqual({
        configFile: './.restqa.yml',
        tag: 'header',
        print: false
      })
  })
})
