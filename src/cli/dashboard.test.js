const path = require('path')

let server

const jestqa = new JestQA(__filename, true)

beforeEach(jestqa.beforeEach)
afterEach(jestqa.afterEach)
jestqa.hooks.beforeEach = function () {
  if (server) {
    server.close()
  }
}

jestqa.hooks.afterEach = function () {
  if (server) {
    server.close()
  }
}

describe('# cli - dashboard', () => {
  test('Throw an error if passed port is not a number', () => {
    const Dashboard = require('./dashboard')
    const program = {
      port: 'hello'
    }
    return expect(() => Dashboard(program)).toThrow('The port should be a number. (example: 8081)')
  })

  test('Throw an error if passed config doesn\'t exist', () => {
    const Dashboard = require('./dashboard')
    const program = {
      port: 8000,
      config: 'test.yml'
    }
    return expect(() => Dashboard(program)).toThrow('The configuration file "test.yml" doesn\'t exist.')
  })

  test('Throw an error if passed default .restqa.yml doesn\'t exist', () => {
    const Dashboard = require('./dashboard')
    const program = {
      port: 8000
    }
    return expect(() => Dashboard(program)).toThrow(`The configuration file "${path.resolve(process.cwd(), '.restqa.yml')}" doesn't exist.`)
  })

  test('Start the server with a specific config', function () {
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
          url: http://localhost:3000
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
restqa:
  dashboard:
    server:
      whiteList:
        - http://localhost:8080
      `
    const filename = jestqa.createTmpFile(content, '.restqa.yml')
    const mockLogger = jestqa.getLoggerMock()

    const Dashboard = require('./dashboard')
    const program = {
      port: 8001,
      config: filename
    }

    server = Dashboard(program)
    return new Promise((resolve, reject) => {
      server.on('listening', () => {
        expect(mockLogger).toHaveBeenCalledTimes(2)
        expect(mockLogger.mock.calls[0][0]).toMatch('📝  The configuration file %s has been loaded')
        expect(mockLogger.mock.calls[0][1]).toMatch(filename)
        expect(mockLogger.mock.calls[1][0]).toMatch('🌎  The RestQA dashboard is started and available on the url: %s')
        expect(mockLogger.mock.calls[1][1]).toMatch('http://localhost:8001')
        resolve()
      })
      expect(server.listening).toBe(true)
    })
  })

  test('Start the server the default config', () => {
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
          url: http://localhost:3000
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
      `
    const filename = jestqa.createCwdConfig(content)
    const mockLogger = jestqa.getLoggerMock()
    const Dashboard = require('./dashboard')
    server = Dashboard({})
    return new Promise((resolve, reject) => {
      server.on('listening', () => {
        expect(mockLogger).toHaveBeenCalledTimes(2)
        expect(mockLogger.mock.calls[0][0]).toMatch('📝  The configuration file %s has been loaded')
        expect(mockLogger.mock.calls[0][1]).toMatch(filename)
        expect(mockLogger.mock.calls[1][0]).toMatch('🌎  The RestQA dashboard is started and available on the url: %s')
        expect(mockLogger.mock.calls[1][1]).toMatch('http://localhost:8081')
        resolve()
      })
      expect(server.listening).toBe(true)
    })
  })

  test('Get the http server instance', () => {
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
          url: http://localhost:3000
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
      `
    jestqa.createCwdConfig(content)
    const mockLogger = jestqa.getLoggerMock()

    const Dashboard = require('./dashboard')
    server = Dashboard({
      serve: false
    })

    const http = require('http')
    expect(mockLogger).toHaveBeenCalledTimes(0)
    expect(server.constructor.name).toBe(http.createServer().constructor.name)
  })
})
