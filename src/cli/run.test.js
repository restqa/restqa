const path = require('path')
const os = require('os')

const jestqa = new JestQA(__filename, true)

beforeEach(jestqa.beforeEach)
afterEach(jestqa.afterEach)

describe('#Cli - Run', () => {
  test('Throw error if the passed file doesnt exist', async () => {
    const filename = path.resolve(os.tmpdir(), '.restqa.fake.yml')

    const options = {
      config: filename,
      stream: 'std-out-example'
    }
    const Run = require('./run')
    return expect(Run(options)).rejects.toThrow(`The configuration file "${filename}" doesn't exist.`)
  })

  test('Throw error if tag is not starting with a @', async () => {
    const filename = path.resolve(os.tmpdir(), '.restqa.fake.yml')
    const options = {
      config: filename,
      stream: 'std-out-example',
      tags: [
        'production',
        '@success'
      ]
    }
    const Run = require('./run')
    return expect(Run(options)).rejects.toThrow('The tags should start with the symbol "@" (example: @production)')
  })

  test('Run the cucumber success tests with passed stdout', async () => {
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
    const filename = jestqa.createTmpFile(content, '.restqa.yml')

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
    const options = {
      config: filename,
      stream: 'std-out-example',
      args: [
        '.',
        os.tmpdir()
      ]
    }
    await Run(options)
    expect(mockCucumberCli.mock.calls).toHaveLength(1)
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
        path.resolve('.', '{*.feature,!(node_modules)', '**', '*.feature}'),
        os.tmpdir()
      ],
      cwd: path.join(__dirname, '../'),
      stdout: 'std-out-example'
    }
    expect(mockCucumberCli.mock.calls[0][0]).toEqual(expectedRunOption)
    expect(mockCucumberRun.mock.calls).toHaveLength(1)
    expect(mockExit).toHaveBeenCalledWith(0)
  })

  test('Run the cucumber failing tests with default stdout', async () => {
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
    const filename = jestqa.createTmpFile(content, '.restqa.yml')

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
    const options = {
      args: [
        path.dirname(filename)
      ]
    }
    await Run(options)
    expect(mockCucumberCli.mock.calls).toHaveLength(1)
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
        path.dirname(filename)
      ],
      cwd: path.join(__dirname, '../'),
      stdout: process.stdout
    }
    expect(mockCucumberCli.mock.calls[0][0]).toEqual(expectedRunOption)
    expect(mockCucumberRun.mock.calls).toHaveLength(1)
    expect(mockExit).toHaveBeenCalledWith(1)
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
    const filename = jestqa.createTmpFile(content, '.restqa.yml')

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
    const options = {
      config: filename
    }
    await Run(options)
    expect(mockCucumberCli.mock.calls).toHaveLength(1)
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
        path.resolve('.', '{*.feature,!(node_modules)', '**', '*.feature}')
      ],
      cwd: path.join(__dirname, '../'),
      stdout: process.stdout
    }
    expect(mockCucumberCli.mock.calls[0][0]).toEqual(expectedRunOption)
    expect(mockCucumberRun.mock.calls).toHaveLength(1)
    expect(mockExit).not.toHaveBeenCalled()
  })

  test('Run the cucumber test with expected tag', async () => {
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
    const filename = jestqa.createTmpFile(content, '.restqa.yml')

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
    const options = {
      config: filename,
      tags: [
        '@production',
        '@success'
      ]
    }
    await Run(options)
    expect(mockCucumberCli.mock.calls).toHaveLength(1)
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
        '--tags',
        '@production',
        '--tags',
        '@success',
        path.resolve('.', '{*.feature,!(node_modules)', '**', '*.feature}')
      ],
      cwd: path.join(__dirname, '../'),
      stdout: process.stdout
    }
    expect(mockCucumberCli.mock.calls[0][0]).toEqual(expectedRunOption)
    expect(mockCucumberRun.mock.calls).toHaveLength(1)
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
    const filename = jestqa.createTmpFile(content, '.restqa.yml')

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

    const Run = require('./run')
    const options = {
      config: filename
    }
    await Run(options)
    expect(mockCucumberCli.mock.calls).toHaveLength(1)
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
        path.resolve('.', '{*.feature,!(node_modules)', '**', '*.feature}')
      ],
      cwd: path.join(__dirname, '../'),
      stdout: process.stdout
    }
    expect(mockCucumberCli.mock.calls[0][0]).toEqual(expectedRunOption)
    expect(mockCucumberRun.mock.calls).toHaveLength(1)
    expect(mockExit).toHaveBeenCalledWith(1)
    expect(jestqa.getLoggerMock()).toHaveBeenCalledTimes(1)
    expect(jestqa.getLoggerMock().mock.calls[0][0]).toMatch('This is an error')
  })
})
