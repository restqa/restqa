const request = require('supertest')
const path = require('path')
const fs = require('fs')
const os = require('os')
const { EventEmitter } = require('events')

let filename

afterEach(() => {
  jest.resetModules()
  jest.resetAllMocks()
  if (filename && fs.existsSync(filename)) {
    fs.unlinkSync(filename)
    filename = undefined
  }
})

beforeEach(() => {
  if (filename && fs.existsSync(filename)) {
    fs.unlinkSync(filename)
    filename = undefined
  }
})

describe('#editor > Server', () => {
  describe('/version', () => {
    test('get version',  async () => {
      const pkg = require('../../package.json')
      const config = {}
      const server = require('./index')(config)
      const response = await request(server).get('/version')
      expect(response.status).toBe(200)
      expect(response.body.version).toBe(pkg.version)
    })
  })

  describe('/api/steps', () => {
    test('throw error if the keyword is not incorrect',  async () => {
      const config = {}
      const server = require('./index')(config)
      const response = await request(server).get('/api/restqa/steps?keyword=cool')
      expect(response.status).toBe(406)
      expect(response.body.message).toBe('"cool" is not a valid argument. Available: given | when | then')
    })

    test('Return the expected steps',  async () => {
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
      - name: '@restqa/restqapi'
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

      const server = require('./index')(filename)
      const response = await request(server).get('/api/restqa/steps?keyword=when')
      expect(response.status).toBe(200)
      const expectedResult = [{
        Comment: 'Trigger the api request',
        Keyword: 'when',
        Plugin: '@restqa/restqapi',
        Step: 'I run the API'
      }]
      expect(response.body).toEqual(expectedResult)
    })

    test('Return all the steps if no keyword is passed',  async () => {
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
      - name: '@restqa/restqapi'
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

      const server = require('./index')(filename)
      const response = await request(server).get('/api/restqa/steps')
      expect(response.status).toBe(200)
      expect(response.body.length > 10).toBe(true)
      expect(response.body.some(el => el.Keyword === 'given')).toBe(true)
      expect(response.body.some(el => el.Keyword === 'when')).toBe(true)
      expect(response.body.some(el => el.Keyword === 'then')).toBe(true)
    })
  })

  describe('/api/generate', () => {
    test('throw error if the command is not a curl command',  async () => {
      const config = {}
      const server = require('./index')(config)
      const response = await request(server)
        .post('/api/restqa/generate')
        .send({cmd: 'ls -lah'})
      expect(response.status).toBe(406)
      expect(response.body.message).toBe('You need to provide a curl command for me to generate an awesome scenario')
    })

    test('Generate the curl command',  async () => {
      filename = path.resolve(os.tmpdir(), '.restqa.yml')

      const server = require('./index')(filename)
      const response = await request(server)
        .post('/api/restqa/generate')
        .send({cmd: 'curl -X GET https://jsonplaceholder.typicode.com/todos/1'})
      expect(response.status).toBe(200)
      const expectedBody = {
        scenario: `
Given I have the api gateway hosted on \"https://jsonplaceholder.typicode.com\"
  And I have the path \"/todos/1\"
  And I have the method \"GET\"
When I run the API
Then I should receive a response with the status 200
  And the response body should be equal to:
  \"\"\"
{
  \"userId\": 1,
  \"id\": 1,
  \"title\": \"delectus aut autem\",
  \"completed\": false
}
  \"\"\"`.trim()
      }
      expect(response.body).toEqual(expectedBody)
    })
  })

  describe('/api/install', () => {
    test('throw error if the integration to install doesn\'t exist',  async () => {
      const config = './restqa.yml'
      const server = require('./index')(config)
      const options = {
        name: 'whatsapp',
        env: 'prod',
        config: {
          url: 'http://webhook.whatsapp.com/test'
        }
      }
      const response = await request(server)
        .post('/api/restqa/install')
        .send(options)
      expect(response.status).toBe(406)
      expect(response.body.message).toBe('The plugin "whatsapp" is not available. Use the command "restqa install" to retrive the list of available plugin')
    })

    test('throw error if the env is not passed',  async () => {
      const config = './restqa.yml'
      const server = require('./index')(config)
      const options = {
        name: 'slack',
        config: {
          url: 'http://webhook.slack.com/test'
        }
      }
      const response = await request(server)
        .post('/api/restqa/install')
        .send(options)
      expect(response.status).toBe(406)
      expect(response.body.message).toBe('Please specify the target environment')
    })

    test('throw error if the env is not available',  async () => {
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
      - name: '@restqa/restqapi'
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

      const server = require('./index')(filename)
      const options = {
        name: 'slack',
        env: 'prod',
        config: {
          url: 'http://webhook.slack.com/test'
        }
      }
      const response = await request(server)
        .post('/api/restqa/install')
        .send(options)
      expect(response.status).toBe(406)
      expect(response.body.message).toBe('"prod" is not an environment available in the config file, choose between : local')
    })

    test('Install slack',  async () => {
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
      - name: '@restqa/restqapi'
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

      const server = require('./index')(filename)
      const options = {
        name: 'slack',
        env: 'local',
        config: {
          url: 'http://webhook.slack.com/test'
        }
      }
      const response = await request(server)
        .post('/api/restqa/install')
        .send(options)
      expect(response.status).toBe(201)
      const expectedResult = `version: 0.0.1
metadata:
  code: API
  name: My test API
  description: The decription of the test api
environments:
  - name: local
    default: true
    plugins:
      - name: "@restqa/restqapi"
        config:
          url: http://localhost:3000
    outputs:
      - type: file
        enabled: true
        config:
          path: my-report.json
      - type: slack
        enabled: true
        config:
          url: http://webhook.slack.com/test
          onlyFailed: false
`
      expect(response.body.config).toEqual(expectedResult)
    })
  })

  describe('/api/run', () => {
    test('throw error if the configuration file  doesn\'t exist',  async () => {
      const config = './.restqa.yml'
      const server = require('./index')(config)
      const options = {
        env: 'prod'
      }
      const response = await request(server)
        .post('/api/restqa/run')
        .send(options)
      expect(response.status).toBe(406)
      expect(response.body.message).toBe(`The configuration file "./.restqa.yml" doesn't exist.`)
    })

    test.skip('Run the test and get the result',  async () => {
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
      - name: '@restqa/restqapi'
        config:
          url: http://localhost:3000
      `
      filename = path.resolve(os.tmpdir(), '.restqa.yml')
      fs.writeFileSync(filename, content)
      const server = require('./index')(filename)
      const options = {
        env: 'local',
        path: path.resolve('./bin/tests/features/success'),
      }
      const response = await request(server)
        .post('/api/restqa/run')
        .send(options)
      expect(response.status).toBe(201)
      expect(response.body.message).toBe(`The configuration file "${path.resolve('.','.restqa.yml')}" doesn't exist.`)
    })
  })

  describe('/info', () => {
    test('share data from the remote restqa server', async () => {
      const emitter = new EventEmitter()
      const mockData = {
        team: {
          note: {
            message: 'hello world',
            from: 'Olivier',
            avatar: 'https://test/olive.png'
          }
        }
      }

      const httpIncomingMessage = {
        statusCode: 200,
        headers: {
          'content-type': 'application/json'
        },
        on: jest.fn((evt, fn) => {
          if ('data' === evt) {
            fn.call(this, Buffer.from(JSON.stringify(mockData)))
          }
        })
      }

      const mockRequest = jest.fn().mockImplementation((options, callback) => {
        if (callback) {
          callback(httpIncomingMessage)
        }
        emitter.end = jest.fn()
        return emitter
      })

      jest.mock('https', () => {
        return {
          request: mockRequest
        }
      })

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
      - name: '@restqa/restqapi'
        config:
          url: http://localhost:3000
      `
      filename = path.resolve(os.tmpdir(), '.restqa.yml')
      fs.writeFileSync(filename, content)
      const server = require('./index')(filename)
      const response = await request(server).get('/api/info')
      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockData)
      expect(mockRequest.mock.calls).toHaveLength(1)
      const expectedOption = {
        hostname: 'restqa.io',
        port: 443,
        path: '/info',
        method: 'GET'
      }
      expect(mockRequest.mock.calls[0][0]).toEqual(expectedOption)
    })

    test('share the default message if the result is not json body', async () => {
      const mockData = '<html>'
      const emitter = new EventEmitter()
      const httpIncomingMessage = {
        statusCode: 200,
        headers: {
          'content-type': 'text/html'
        },
        on: jest.fn((evt, fn) => {
          if ('data' === evt) {
            fn.call(this, Buffer.from(JSON.stringify(mockData)))
          }
        })
      }

      const mockRequest = jest.fn().mockImplementation((options, callback) => {
        if (callback) {
          callback(httpIncomingMessage)
        }
        emitter.end = jest.fn()
        return emitter
      })


      jest.mock('https', () => {
        return {
          request: mockRequest
        }
      })

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
      - name: '@restqa/restqapi'
        config:
          url: http://localhost:3000
      `
      filename = path.resolve(os.tmpdir(), '.restqa.yml')
      fs.writeFileSync(filename, content)
      const server = require('./index')(filename)
      const response = await request(server).get('/api/info')
      expect(response.status).toBe(200)
      const defaultData = {
        team: {
          note: {
            message: 'We are happy to have you in the RestQA Family, we are happy to support you on your testing journey. ❤️',
            from: 'RestQA team',
            avatar: '/logo.png'
          }
        }
      }
      expect(response.body).toEqual(defaultData)
      expect(mockRequest.mock.calls).toHaveLength(1)
    })

    test('share the default information if the calls fail', async () => {
      const httpIncomingMessage = {
        statusCode: 500,
        headers: {},
        on: () => {
          //emitter.emit('error', new Error('oups'))
        }
      }

      const mockRequest = jest.fn().mockImplementation((options, callback) => {
        if (callback) {
          callback(httpIncomingMessage)
        }
        const req = {
          on: (evt, fn) => {
            fn(new Error('couocu'))
          },
          end: jest.fn()
        }
        return req
      })


      jest.mock('https', () => {
        return {
          request: mockRequest
        }
      })

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
      - name: '@restqa/restqapi'
        config:
          url: http://localhost:3000
      `
      filename = path.resolve(os.tmpdir(), '.restqa.yml')
      fs.writeFileSync(filename, content)
      const server = require('./index')(filename)
      const response = await request(server).get('/api/info')
      expect(response.status).toBe(200)
      const defaultData = {
        team: {
          note: {
            message: 'We are happy to have you in the RestQA Family, we are happy to support you on your testing journey. ❤️',
            from: 'RestQA team',
            avatar: '/logo.png'
          }
        }
      }
      expect(response.body).toEqual(defaultData)
      expect(mockRequest.mock.calls).toHaveLength(1)
    })
  })
})
