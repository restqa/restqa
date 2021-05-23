const nock = require('nock')
const request = require('supertest')
const path = require('path')
const fs = require('fs')
const os = require('os')
const rimraf = require('rimraf')
const { EventEmitter } = require('events')

let filename

const jestqa = new JestQA(__filename, false)

afterEach(() => {
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

let buggedReportforlder
afterAll(() => {
  if (buggedReportforlder && fs.existsSync(buggedReportforlder)) {
    rimraf.sync(buggedReportforlder)
  }
  nock.cleanAll()
  nock.enableNetConnect()
})

jest.mock('../utils/logger', () => {
  return {
    info: jest.fn(),
    log: jest.fn(),
    success: jest.fn()
  }
})

const server = require('./index')

describe('#dashboard > Server', () => {
  describe('cors management', () => {
    test('does not return allows headers if the origin is not on the default white list', async () => {
      const config = {}
      const response = await request(server(config))
        .get('/tes-cors')
      expect(response.status).toBe(404)
      expect(response.header['access-control-allow-origin']).toBeUndefined()
      expect(response.header['access-control-allow-headers']).toBeUndefined()
    })

    test('return allows headers if the origin is on the default white list', async () => {
      const config = {}
      const response = await request(server(config))
        .get('/tes-cors')
        .set('origin', 'http://localhost:3000')
      expect(response.status).toBe(404)
      expect(response.header['access-control-allow-origin']).toBe('http://localhost:3000')
      expect(response.header['access-control-allow-headers']).toBe('Origin, X-Requested-With, Content-Type, Accept')
    })

    test('return allows headers if the origin is on the config white list', async () => {
      const config = {}
      const options = {
        server: {
          whiteList: 'https://www.foo-bar.com'
        }
      }
      const response = await request(server(config, options))
        .get('/tes-cors')
        .set('origin', 'https://www.foo-bar.com')
      expect(response.status).toBe(404)
      expect(response.header['access-control-allow-origin']).toBe('https://www.foo-bar.com')
      expect(response.header['access-control-allow-headers']).toBe('Origin, X-Requested-With, Content-Type, Accept')
    })
  })

  describe('/version', () => {
    test('get version', async () => {
      const pkg = require('../../package.json')
      const config = {}
      const response = await request(server(config)).get('/version')
      expect(response.status).toBe(200)
      expect(response.body.version).toBe(pkg.version)
    })
  })

  describe('/api/steps', () => {
    test('throw error if the keyword is not incorrect', async () => {
      const config = {}
      const response = await request(server(config)).get('/api/restqa/steps?keyword=cool')
      expect(response.status).toBe(406)
      expect(response.body.message).toBe('"cool" is not a valid argument. Available: given | when | then')
    })

    test('Return the expected steps', async () => {
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

      const response = await request(server(filename)).get('/api/restqa/steps?keyword=when')
      expect(response.status).toBe(200)
      const expectedResult = [{
        comment: 'Trigger the api request',
        keyword: 'when',
        plugin: '@restqa/restqapi',
        step: 'I run the API'
      }]
      expect(response.body).toEqual(expectedResult)
    })

    test('Return all the steps if no keyword is passed', async () => {
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

      const response = await request(server(filename)).get('/api/restqa/steps')
      expect(response.status).toBe(200)
      expect(response.body.length > 10).toBe(true)
      expect(response.body.some(el => el.keyword === 'given')).toBe(true)
      expect(response.body.some(el => el.keyword === 'when')).toBe(true)
      expect(response.body.some(el => el.keyword === 'then')).toBe(true)
    })
  })

  describe('/api/initialize', () => {
    test('throw error if name is not defined', async () => {
      const folder = jestqa.getTmpFolder()
      const config = {}
      const response = await request(server(config))
        .post('/api/restqa/initialize')
        .send({
          folder
        })
      expect(response.status).toBe(406)
      expect(response.body.message).toBe('Please share a project name.')
    })

    test('throw error if description is not defined', async () => {
      const folder = jestqa.getTmpFolder()
      const config = {}
      const response = await request(server(config))
        .post('/api/restqa/initialize')
        .send({
          name: 'Backend api',
          folder
        })
      expect(response.status).toBe(406)
      expect(response.body.message).toBe('Please share a project description.')
    })

    test('throw error if url is not defined', async () => {
      const folder = jestqa.getTmpFolder()
      const config = {}
      const response = await request(server(config))
        .post('/api/restqa/initialize')
        .send({
          name: 'Backend api',
          description: 'All the API used by the different frontends',
          folder
        })
      expect(response.status).toBe(406)
      expect(response.body.message).toBe('Please share a project url.')
    })

    test('throw error if env is not defined', async () => {
      const folder = jestqa.getTmpFolder()
      const config = {}
      const response = await request(server(config))
        .post('/api/restqa/initialize')
        .send({
          name: 'Backend api',
          description: 'All the API used by the different frontends',
          url: 'https://api.example.com',
          folder
        })
      expect(response.status).toBe(406)
      expect(response.body.message).toBe('Please share a project url environment.')
    })

    test('throw error if ci tool is invalid', async () => {
      const folder = jestqa.getTmpFolder()
      const config = {}
      const response = await request(server(config))
        .post('/api/restqa/initialize')
        .send({
          name: 'Backend api',
          description: 'All the API used by the different frontends',
          url: 'https://api.example.com',
          ci: 'gocd',
          env: 'uat',
          folder
        })
      expect(response.status).toBe(406)
      expect(response.body.message).toBe('The continous integration "gocd" is not supported by RestQa')
    })

    test('Create a new restqa project', async () => {
      nock('https://restqa.io')
        .get('/welcome.json')
        .reply(200, {
          foo: 'bar'
        })

      const folder = jestqa.getTmpFolder()
      const config = {}
      const response = await request(server(config))
        .post('/api/restqa/initialize')
        .send({
          name: 'Backend api',
          description: 'All the API used by the different frontends',
          url: 'https://api.example.com',
          env: 'uat',
          ci: 'gitlab-ci',
          folder
        })
      expect(response.status).toBe(200)
      expect(response.body.configuration).toBe(path.join(folder, '.restqa.yml'))
      expect(response.body.folder).toEqual(folder)
      expect(fs.existsSync(path.join(folder, '.restqa.yml'))).toBe(true)
      expect(fs.existsSync(path.join(folder, '.gitlab-ci.yml'))).toBe(true)
      expect(fs.existsSync(path.join(folder, 'tests', 'integration', 'welcome-restqa.feature'))).toBe(true)
    })
  })

  describe('/api/generate', () => {
    test('throw error if the command is not a curl command', async () => {
      const config = {}
      const response = await request(server(config))
        .post('/api/restqa/generate')
        .send({ cmd: 'ls -lah' })
      expect(response.status).toBe(406)
      expect(response.body.message).toBe('You need to provide a curl command for me to generate an awesome scenario')
    })

    test('Generate the curl command', async () => {
      nock('https://jsonplaceholder.typicode.com')
        .get('/todos/1')
        .reply(200, {
          userId: 1,
          id: 1,
          title: 'delectus aut autem',
          completed: false
        })

      filename = path.resolve(os.tmpdir(), '.restqa.yml')

      const response = await request(server(filename))
        .post('/api/restqa/generate')
        .send({ cmd: 'curl -X GET https://jsonplaceholder.typicode.com/todos/1' })
      expect(response.status).toBe(200)
      const expectedBody = {
        scenario: `
Given I have the api gateway hosted on "https://jsonplaceholder.typicode.com"
  And I have the path "/todos/1"
  And I have the method "GET"
When I run the API
Then I should receive a response with the status 200
  And the response body should be equal to:
  """
{
  "userId": 1,
  "id": 1,
  "title": "delectus aut autem",
  "completed": false
}
  """`.trim()
      }
      expect(response.body).toEqual(expectedBody)
    })
  })

  describe('/api/install', () => {
    test('throw error if the integration to install doesn\'t exist', async () => {
      const config = './restqa.yml'
      const options = {
        name: 'whatsapp',
        env: 'prod',
        config: {
          url: 'http://webhook.whatsapp.com/test'
        }
      }
      const response = await request(server(config))
        .post('/api/restqa/install')
        .send(options)
      expect(response.status).toBe(406)
      expect(response.body.message).toBe('The plugin "whatsapp" is not available. Use the command "restqa install" to retrive the list of available plugin')
    })

    test('throw error if the env is not passed', async () => {
      const config = './restqa.yml'
      const options = {
        name: 'slack',
        config: {
          url: 'http://webhook.slack.com/test'
        }
      }
      const response = await request(server(config))
        .post('/api/restqa/install')
        .send(options)
      expect(response.status).toBe(406)
      expect(response.body.message).toBe('Please specify the target environment')
    })

    test('throw error if the env is not available', async () => {
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

      const options = {
        name: 'slack',
        env: 'prod',
        config: {
          url: 'http://webhook.slack.com/test'
        }
      }
      const response = await request(server(filename))
        .post('/api/restqa/install')
        .send(options)
      expect(response.status).toBe(406)
      expect(response.body.message).toBe('"prod" is not an environment available in the config file, choose between : local')
    })

    test('Install slack', async () => {
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

      const options = {
        name: 'slack',
        env: 'local',
        config: {
          url: 'http://webhook.slack.com/test'
        }
      }
      const response = await request(server(filename))
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
    test('throw error if the configuration file  doesn\'t exist', async () => {
      const config = './.restqa.yml'
      const options = {
        env: 'prod'
      }
      const response = await request(server(config))
        .post('/api/restqa/run')
        .send(options)
      expect(response.status).toBe(406)
      expect(response.body.message).toBe('The configuration file "./.restqa.yml" doesn\'t exist.')
    })

    test.skip('Run the test and get the result', async () => {
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
      const options = {
        env: 'local',
        path: path.resolve('./bin/tests/features/success')
      }
      const response = await request(server(filename))
        .post('/api/restqa/run')
        .send(options)
      expect(response.status).toBe(201)
      expect(response.body.message).toBe(`The configuration file "${path.resolve('.', '.restqa.yml')}" doesn't exist.`)
    })
  })

  describe('/report', () => {
    let reportFolder

    beforeEach(() => {
      if (fs.existsSync(reportFolder)) {
        rimraf.sync(reportFolder)
      }
    })

    afterEach(() => {
      if (fs.existsSync(reportFolder)) {
        rimraf.sync(reportFolder)
      }
    })

    test('Create a report for a result using default value', async () => {
      const jsonBody = {
        id: `xx-yyy-zzzz-${Math.floor(Math.random() * 1000)}`
      }

      buggedReportforlder = path.resolve(process.cwd(), 'reports')

      const config = {}
      const response = await request(server(config))
        .post('/reports')
        .send(jsonBody)
      expect(response.status).toBe(201)
      expect(response.body.id).toEqual(jsonBody.id)
      expect(response.body.url).toMatch(new RegExp(`http://127.0.0.1:(\\d{5})/reports/${jsonBody.id}`))
      const expectedReport = path.resolve(buggedReportforlder, jsonBody.id, 'index.html')
      expect(fs.existsSync(expectedReport)).toBe(true)
    })

    test('Create a report for a result using passed options', async () => {
      const jsonBody = {
        id: `xx-yyy-zzzz-${Math.floor(Math.random() * 1000)}`
      }

      reportFolder = path.resolve(os.tmpdir(), 'reports')

      const config = {}
      const options = {
        server: {
          report: {
            urlPrefixPath: '/reports-restqa',
            outputFolder: reportFolder
          }
        }
      }
      const response = await request(server(config, options))
        .post('/reports')
        .send(jsonBody)
      expect(response.status).toBe(201)
      expect(response.body.id).toEqual(jsonBody.id)
      expect(response.body.url).toMatch(new RegExp(`http://127.0.0.1:(\\d{5})/reports-restqa/${jsonBody.id}`))
      const expectedReport = path.resolve(reportFolder, jsonBody.id, 'index.html')
      expect(fs.existsSync(expectedReport)).toBe(true)
    })

    test('Retrieve the list of report', async () => {
      const jsonBody = {
        id: `xx-yyy-zzzz-${Math.floor(Math.random() * 1000)}`
      }

      reportFolder = path.resolve(os.tmpdir(), 'reports-gets')
      fs.mkdirSync(reportFolder)

      const config = {}
      const options = {
        server: {
          report: {
            outputFolder: reportFolder
          }
        }
      }

      const svr = server(config, options)
      let response = await request(svr)
        .get('/reports')
      expect(response.status).toBe(200)
      expect(response.body).toEqual([])

      await request(svr)
        .post('/reports')
        .send(jsonBody)

      response = await request(svr)
        .get('/reports')

      expect(response.status).toBe(200)
      expect(response.body).toHaveLength(1)
      expect(response.body[0].id).toEqual(jsonBody.id)
      expect(response.body[0].url).toMatch(new RegExp(`http://127.0.0.1:(\\d{5})/reports/${jsonBody.id}`))
    })

    test('Access to the dashboard', async () => {
      const jsonBody = {
        id: `xx-yyy-zzzz-${Math.floor(Math.random() * 1000)}`
      }

      reportFolder = path.resolve(os.tmpdir(), 'reports-gets')
      fs.mkdirSync(reportFolder)

      const config = {}
      const options = {
        server: {
          report: {
            urlPrefixPath: '/reports-restqa',
            outputFolder: reportFolder
          }
        }
      }

      const svr = server(config, options)
      let response = await request(svr)
        .get(`/reports-restqa/${jsonBody.id}`)
      expect(response.status).toBe(404)

      await request(svr)
        .post('/reports')
        .send(jsonBody)

      response = await request(svr)
        .get(`/reports-restqa/${jsonBody.id}`)

      expect(response.status).toBe(301)
      expect(response.headers['content-type']).toEqual('text/html; charset=UTF-8')
    })
  })

  describe('/info', () => {
    beforeEach(() => {
      jest.resetModules()
      jest.resetAllMocks()
    })

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
          if (evt === 'data') {
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
          if (evt === 'data') {
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
          blog: {
            url: 'https://medium.com/restqa',
            last: {
              title: 'RestQA is here! Do your end-to-end API test integration, the right way!',
              date: '2021-02-02 02:24:19',
              image: 'https://cdn-images-1.medium.com/max/1024/1*iyyY6QkAAE2bOzNRevfCuw.png',
              author: {
                username: '@Olivierodo',
                avatar: 'https://cdn-images-1.medium.com/fit/c/150/150/1*acYALd6w84KRScRNMpFLUg.jpeg'
              },
              url: 'https://medium.com/restqa/restqa-is-here-do-your-end-to-end-api-test-integration-the-right-way-84b7313e1291'
            }
          },
          video: {
            url: 'https://www.youtube.com/channel/UCdT6QenNLmnxNT-aT8nYq_Q',
            last: {
              title: 'RestQA',
              date: '2021-04-17 03:00:30',
              image: 'https://i2.ytimg.com/vi/EberYFGPZPo/hqdefault.jpg',
              url: 'https://www.youtube.com/watch?v=EberYFGPZPo'
            }
          },
          note: {
            message: 'We are happy to have you in the RestQA Family, we are happy to support you on your testing journey. ❤️',
            from: 'RestQA team',
            avatar: '/logo.png'
          }
        },
        sponsors: [
          {
            url: 'https://atalent-consulting.com',
            name: 'RestQA is here! Do your end-to-end API test integration, the right way!',
            logo: 'https://atalent-consulting.com/logo.png'
          }
        ]
      }
      expect(response.body).toEqual(defaultData)
      expect(mockRequest.mock.calls).toHaveLength(1)
    })

    test('share the default information if the calls fail', async () => {
      const httpIncomingMessage = {
        statusCode: 500,
        headers: {},
        on: () => {
          // emitter.emit('error', new Error('oups'))
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
          blog: {
            url: 'https://medium.com/restqa',
            last: {
              title: 'RestQA is here! Do your end-to-end API test integration, the right way!',
              date: '2021-02-02 02:24:19',
              image: 'https://cdn-images-1.medium.com/max/1024/1*iyyY6QkAAE2bOzNRevfCuw.png',
              author: {
                username: '@Olivierodo',
                avatar: 'https://cdn-images-1.medium.com/fit/c/150/150/1*acYALd6w84KRScRNMpFLUg.jpeg'
              },
              url: 'https://medium.com/restqa/restqa-is-here-do-your-end-to-end-api-test-integration-the-right-way-84b7313e1291'
            }
          },
          video: {
            url: 'https://www.youtube.com/channel/UCdT6QenNLmnxNT-aT8nYq_Q',
            last: {
              title: 'RestQA',
              date: '2021-04-17 03:00:30',
              image: 'https://i2.ytimg.com/vi/EberYFGPZPo/hqdefault.jpg',
              url: 'https://www.youtube.com/watch?v=EberYFGPZPo'
            }
          },
          note: {
            message: 'We are happy to have you in the RestQA Family, we are happy to support you on your testing journey. ❤️',
            from: 'RestQA team',
            avatar: '/logo.png'
          }
        },
        sponsors: [
          {
            url: 'https://atalent-consulting.com',
            name: 'RestQA is here! Do your end-to-end API test integration, the right way!',
            logo: 'https://atalent-consulting.com/logo.png'
          }
        ]
      }
      expect(response.body).toEqual(defaultData)
      expect(mockRequest.mock.calls).toHaveLength(1)
    })
  })
})
