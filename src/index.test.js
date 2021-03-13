const Stream = require('stream')
const os = require('os')
const fs = require('fs')
const path = require('path')

afterEach(() => {
  jest.resetModules()
  jest.resetAllMocks()
})

describe('# Index - Generate', () => {
  test('Throw an error if the command is not a curl command', () => {
    const { Generate } = require('./index')
    const cmd = 'ls -lah'
    return expect(Generate(cmd)).rejects.toThrow('You need to provide a curl command for me to generate an awesome scenario')
  })

  test('Resolve the generate command', async () => {
    const mockGenerate = jest.fn().mockResolvedValue('result')
    jest.mock('./cli/generate', () => {
      return mockGenerate
    })

    const { Generate } = require('./index')
    const cmd = 'curl https://jsonplaceholder.typicode.com/todos/1'
    await expect(Generate(cmd)).resolves.toEqual('result')
    expect(mockGenerate.mock.calls).toHaveLength(1)
    const expectedOption = {
      args: [
        'curl',
        'https://jsonplaceholder.typicode.com/todos/1'
      ],
      print: false
    }
    expect(mockGenerate.mock.calls[0][0]).toEqual(expectedOption)
  })

  test('Curl command with a lot of options', async () => {
    const mockGenerate = jest.fn().mockResolvedValue('result')
    jest.mock('./cli/generate', () => {
      return mockGenerate
    })

    const { Generate } = require('./index')
    const cmd = 'curl --url https://example/send --header "content-type: application/x-www-form-urlencoded" --cookie "JSESSIONID=B28CABC3FA3059E10CDE5201105D90F1" -d "ACCOUNT=@ccount" --data "PASSWORD=THIS_IS_PASS" --data-raw "MOBILE=09876463" --data "MESSAGE=test-sms"'

    await expect(Generate(cmd)).resolves.toEqual('result')
    expect(mockGenerate.mock.calls).toHaveLength(1)
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
    expect(mockInstall.generate.mock.calls).toHaveLength(1)
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
    expect(mockSteps.mock.calls).toHaveLength(1)
    expect(mockSteps.mock.calls[0][0]).toEqual('then')
    expect(mockSteps.mock.calls[0][1]).toEqual({
      config: '/tmp/.restqa.yml',
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
    expect(mockSteps.mock.calls).toHaveLength(1)
    expect(mockSteps.mock.calls[0][0]).toEqual('then')
    expect(mockSteps.mock.calls[0][1]).toEqual({
      config: './.restqa.yml',
      tag: 'header',
      print: false
    })
  })

  describe('# Index - Run', () => {
    let filename
    beforeEach(() => {
      if (filename && fs.existsSync(filename)) {
        fs.unlinkSync(filename)
        filename = undefined
      }
    })

    test('Get result from run', async () => {
      jest.spyOn(Math, 'random').mockImplementation(() => '0.6140915758927235')
      filename = path.resolve(os.tmpdir(), 'restqa-result-6140915.json')
      const mockRun = jest.fn().mockImplementation(() => {
        // simulate the writting of an file export from cucumber-export module
        fs.writeFileSync(filename, JSON.stringify({ foo: 'bar' }))
        return Promise.resolve('result')
      })

      jest.mock('./cli/run', () => {
        return mockRun
      })

      const stream = new Stream.Writable()

      const opt = {
        configFile: '/tmp/.restqa.yml',
        env: 'local',
        stream,
        path: 'tests/'
      }

      const { Run } = require('./index')
      await expect(Run(opt)).resolves.toEqual({ foo: 'bar' })
      expect(mockRun.mock.calls).toHaveLength(1)
      expect(mockRun.mock.calls[0][0]).toEqual({
        config: '/tmp/.restqa.yml',
        env: 'local',
        stream,
        args: ['tests/']
      })
    })

    test('Get result from run without path', async () => {
      jest.spyOn(Math, 'random').mockImplementation(() => '0.6140915758927235')
      filename = path.resolve(os.tmpdir(), 'restqa-result-6140915.json')
      const mockRun = jest.fn().mockImplementation(() => {
        // simulate the writting of an file export from cucumber-export module
        fs.writeFileSync(filename, JSON.stringify({ foo: 'bar' }))
        return Promise.resolve('result')
      })

      jest.mock('./cli/run', () => {
        return mockRun
      })

      const stream = new Stream.Writable()

      const opt = {
        configFile: '/tmp/.restqa.yml',
        env: 'local',
        stream
      }

      const { Run } = require('./index')
      await expect(Run(opt)).resolves.toEqual({ foo: 'bar' })
      expect(mockRun.mock.calls).toHaveLength(1)
      expect(mockRun.mock.calls[0][0]).toEqual({
        config: '/tmp/.restqa.yml',
        env: 'local',
        stream
      })
    })

    test('throw error if runner has an issue', async () => {
      const mockRun = jest.fn().mockRejectedValue(new Error('Issue with the file'))

      jest.mock('./cli/run', () => {
        return mockRun
      })

      const stream = new Stream.Writable()
      const opt = {
        configFile: '/tmp/.restqa.yml',
        env: 'local',
        stream
      }

      const { Run } = require('./index')
      await expect(Run(opt)).rejects.toEqual(new Error('Issue with the file'))
      expect(mockRun.mock.calls).toHaveLength(1)
      expect(mockRun.mock.calls[0][0]).toEqual({
        config: '/tmp/.restqa.yml',
        env: 'local',
        stream
      })
    })
  })
})
