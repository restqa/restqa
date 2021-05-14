const os = require('os')
const path = require('path')
const fs = require('fs')

let filename
let server

afterEach(() => {
  jest.resetModules()
  jest.resetAllMocks()
  if (filename && fs.existsSync(filename)) {
    fs.unlinkSync(filename)
    filename = undefined
  }

  if (server) {
    server.close()
  }
})

beforeEach(() => {
  if (filename && fs.existsSync(filename)) {
    fs.unlinkSync(filename)
    filename = undefined
  }

  if (server) {
    server.close()
  }
})

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

  test('Start the server with a specific config', () => {
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
    filename = path.resolve(os.tmpdir(), '.restqa.yml')
    fs.writeFileSync(filename, content)

    const mockLogger = {
      info: jest.fn(),
      log: jest.fn(),
      success: jest.fn()
    }

    jest.mock('../utils/logger', () => {
      return mockLogger
    })

    const Dashboard = require('./dashboard')
    const program = {
      port: 8001,
      config: filename
    }

    server = Dashboard(program)
    return new Promise((resolve, reject) => {
      server.on('listening', () => {
        expect(mockLogger.info.mock.calls).toHaveLength(2)
        expect(mockLogger.info.mock.calls[0][0]).toEqual(`📝  The configuration file ${filename} has been loaded`)
        expect(mockLogger.info.mock.calls[1][0]).toEqual('🌎  The RestQA dashboard is started and available on the url: http://localhost:8001')
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
    filename = path.resolve(process.cwd(), '.restqa.yml')
    fs.writeFileSync(filename, content)

    const mockLogger = {
      info: jest.fn(),
      log: jest.fn(),
      success: jest.fn()
    }

    jest.mock('../utils/logger', () => {
      return mockLogger
    })

    const Dashboard = require('./dashboard')
    server = Dashboard({})
    return new Promise((resolve, reject) => {
      server.on('listening', () => {
        expect(mockLogger.info.mock.calls).toHaveLength(2)
        expect(mockLogger.info.mock.calls[0][0]).toEqual(`📝  The configuration file ${filename} has been loaded`)
        expect(mockLogger.info.mock.calls[1][0]).toEqual('🌎  The RestQA dashboard is started and available on the url: http://localhost:8081')
        resolve()
      })
      expect(server.listening).toBe(true)
    })
  })

  test('Get the http server  starting it', () => {
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
    filename = path.resolve(process.cwd(), '.restqa.yml')
    fs.writeFileSync(filename, content)

    const mockLogger = {
      info: jest.fn(),
      log: jest.fn(),
      success: jest.fn()
    }

    jest.mock('../utils/logger', () => {
      return mockLogger
    })

    const Dashboard = require('./dashboard')
    server = Dashboard({
      serve: false
    })

    const http = require('http')
    expect(mockLogger.info.mock.calls).toHaveLength(0)
    expect(server.constructor.name).toBe(http.createServer().constructor.name)
  })
})
