const fs = require('fs')
const path = require('path')
const os = require('os')
let filename

beforeEach(() => {
  jest.resetModules()
  jest.resetAllMocks()
})

describe('#Cli - Run', () => {
  test('Throw error if the passed file doesnt exist', async () => {
    filename = `/${os.tmpdir()}/.restqa.fake.yml`

    let options = {
      config: filename,
      stream: 'std-out-example'
    }
    const Run = require('./run')
    expect(Run(options)).rejects.toThrow(`The configuration file "${filename}" doesn't exit.`)
  })

  test('Run the cucumber success tests with passed stdout ', async () => {
    const content = `
---

version: 0.0.1
metadata:
  code: API
  name: My test API
  description: The decription of the test api
environments:
  - name: local
    default: true
    plugins:
      - name: restqapi
        config:
          url: http://host.docker.internal:4046
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
    `
    filename = `/tmp/.restqa.yml`
    fs.writeFileSync(filename, content)

    const mockCucumberRun = jest.fn().mockResolvedValue({
      shouldExitImmediately: true,
      success: true
    })

    const mockCucumberCli = jest.fn().mockImplementation(() => {
        return {
          run: mockCucumberRun
        }
    })

    jest.mock('cucumber', () => {
      return {
        Cli: mockCucumberCli
      }
    })

    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {})

    const Run = require('./run')
    let options = {
      config: filename,
      stream: 'std-out-example'
    }
    const result = await Run(options)
    expect(mockCucumberCli.mock.calls.length).toBe(1)
    const expectedRunOption = {
      argv: [
        'node',
        'cucumber-js',
        '--require',
        '../src/setup.js',
        '--format',
        '../src/restqa-formatter:.restqa.log',
        '--format-options',
        '{"snippetSyntax": "../src/restqa-snippet.js"}',
        path.resolve('.')
      ],
      cwd: path.join(__dirname, '../'),
      stdout: 'std-out-example'
    }
    expect(mockCucumberCli.mock.calls[0][0]).toEqual(expectedRunOption)
    expect(mockCucumberRun.mock.calls.length).toEqual(1)
    expect(mockExit).toHaveBeenCalledWith(0);
  })

  test('Run the cucumber failing tests with default stdout ', async () => {
    const content = `
---

version: 0.0.1
metadata:
  code: API
  name: My test API
  description: The decription of the test api
environments:
  - name: local
    default: true
    plugins:
      - name: restqapi
        config:
          url: http://host.docker.internal:4046
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
    `
    filename = `/tmp/.restqa.yml`
    fs.writeFileSync(filename, content)

    const mockCucumberRun = jest.fn().mockResolvedValue({
      shouldExitImmediately: true,
      success: false
    })

    const mockCucumberCli = jest.fn().mockImplementation(() => {
        return {
          run: mockCucumberRun
        }
    })

    jest.mock('cucumber', () => {
      return {
        Cli: mockCucumberCli
      }
    })

    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {})

    const Run = require('./run')
    let options = {
      config: filename
    }
    const result = await Run(options)
    expect(mockCucumberCli.mock.calls.length).toBe(1)
    const expectedRunOption = {
      argv: [
        'node',
        'cucumber-js',
        '--require',
        '../src/setup.js',
        '--format',
        '../src/restqa-formatter:.restqa.log',
        '--format-options',
        '{"snippetSyntax": "../src/restqa-snippet.js"}',
        path.resolve('.')
      ],
      cwd: path.join(__dirname, '../'),
      stdout: process.stdout
    }
    expect(mockCucumberCli.mock.calls[0][0]).toEqual(expectedRunOption)
    expect(mockCucumberRun.mock.calls.length).toEqual(1)
    expect(mockExit).toHaveBeenCalledWith(1);
  })

  test('Run the cucumber test but shouldnt exit', async () => {
    const content = `
---

version: 0.0.1
metadata:
  code: API
  name: My test API
  description: The decription of the test api
environments:
  - name: local
    default: true
    plugins:
      - name: restqapi
        config:
          url: http://host.docker.internal:4046
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
    `
    filename = `/tmp/.restqa.yml`
    fs.writeFileSync(filename, content)

    const mockCucumberRun = jest.fn().mockResolvedValue({
      shouldExitImmediately: false,
      success: false
    })

    const mockCucumberCli = jest.fn().mockImplementation(() => {
        return {
          run: mockCucumberRun
        }
    })

    jest.mock('cucumber', () => {
      return {
        Cli: mockCucumberCli
      }
    })

    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {})

    const Run = require('./run')
    let options = {
      config: filename
    }
    const result = await Run(options)
    expect(mockCucumberCli.mock.calls.length).toBe(1)
    const expectedRunOption = {
      argv: [
        'node',
        'cucumber-js',
        '--require',
        '../src/setup.js',
        '--format',
        '../src/restqa-formatter:.restqa.log',
        '--format-options',
        '{"snippetSyntax": "../src/restqa-snippet.js"}',
        path.resolve('.')
      ],
      cwd: path.join(__dirname, '../'),
      stdout: process.stdout
    }
    expect(mockCucumberCli.mock.calls[0][0]).toEqual(expectedRunOption)
    expect(mockCucumberRun.mock.calls.length).toEqual(1)
    expect(mockExit).not.toHaveBeenCalled()
  })

  test('Error during cucumber run execution', async () => {
    const content = `
---

version: 0.0.1
metadata:
  code: API
  name: My test API
  description: The decription of the test api
environments:
  - name: local
    default: true
    plugins:
      - name: restqapi
        config:
          url: http://host.docker.internal:4046
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
    `
    filename = `/tmp/.restqa.yml`
    fs.writeFileSync(filename, content)

    const mockCucumberRun = jest.fn().mockRejectedValue(new Error('This is an error'))

    const mockCucumberCli = jest.fn().mockImplementation(() => {
        return {
          run: mockCucumberRun
        }
    })

    jest.mock('cucumber', () => {
      return {
        Cli: mockCucumberCli
      }
    })

    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {})
    const mockLogger = {
      error: jest.fn()
    }

    jest.mock('../utils/logger', () => {
      return mockLogger
    })

    const Run = require('./run')
    let options = {
      config: filename
    }
    const result = await Run(options)
    expect(mockCucumberCli.mock.calls.length).toBe(1)
    const expectedRunOption = {
      argv: [
        'node',
        'cucumber-js',
        '--require',
        '../src/setup.js',
        '--format',
        '../src/restqa-formatter:.restqa.log',
        '--format-options',
        '{"snippetSyntax": "../src/restqa-snippet.js"}',
        path.resolve('.')
      ],
      cwd: path.join(__dirname, '../'),
      stdout: process.stdout
    }
    expect(mockCucumberCli.mock.calls[0][0]).toEqual(expectedRunOption)
    expect(mockCucumberRun.mock.calls.length).toEqual(1)
    expect(mockExit).toHaveBeenCalledWith(1)
    expect(mockLogger.error.mock.calls.length).toBe(1)
    expect(mockLogger.error.mock.calls[0][0]).toEqual(new Error('This is an error'))
  })
})
