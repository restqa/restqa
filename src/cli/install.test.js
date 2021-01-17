process.setMaxListeners(Infinity)

const fs = require('fs')
const path = require('path')
const YAML = require('yaml')

let filename

beforeEach(() => {
  if (filename && fs.existsSync(filename)) {
    fs.unlinkSync(filename)
  }

  jest.mock('../utils/logger', () => {
    return {
      info: jest.fn(),
      log: jest.fn(),
      success: jest.fn()
    }
  })

})

afterEach(() => {
  jest.resetModules()
  jest.resetAllMocks()

  if (filename && fs.existsSync(filename)) {
    fs.unlinkSync(filename)
  }
})


describe('#Cli - install', () => {

  describe('generate', () => {

    test('Throw an error if the plugin name is not available', () => {
      const Install = require('./install')
      const options =  {
        name: 'signal'
      }
  
      expect(() => Install.generate(options)).toThrow('The plugin "signal" is not available')
    })
  
  
    test('Throw an error if the environement is not defined', () => {
      const Install = require('./install')
      const options =  {
        name: 'slack',
      }
  
      expect(() => Install.generate(options)).toThrow('Please specify the target environment')
    })
  
    test('Throw an error if configFile is not defined', () => {
      const Install = require('./install')
      const options =  {
        env: 'prod',
        name: 'slack'
      }
  
      expect(() => Install.generate(options)).toThrow('Please specify the location of the configuration file')
    })
  
    test('Throw an error if configFile is doesnt exist', () => {
      const Install = require('./install')
      const options = {
        configFile: '/tmp/missing.yml',
        name: 'slack',
        env: 'prod',
      }
  
      expect(() => Install.generate(options)).toThrow('The config file "/tmp/missing.yml" doesn\'t exists')
    })
  
    test('Throw an error if the environement is not on configuration file', () => {
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
  - name: uat
    plugins:
      - name: restqapi
        config:
          url: http://test.uat.com
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
      `
      filename = `/tmp/.restqa.yml`
      fs.writeFileSync(filename, content)
  
      const Install = require('./install')
      const options =  {
        configFile: filename,
        name: 'slack',
        env: 'prod',
      }
  
      expect(() => Install.generate(options)).toThrow('"prod" is not an environment available in the config file, choose between : local, uat')
    })
  
    test('Throw an error if the slack config doesn\'t contain the url', () => {
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
  - name: uat
    plugins:
      - name: restqapi
        config:
          url: http://test.uat.com
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
      `
      filename = `/tmp/.restqa.yml`
      fs.writeFileSync(filename, content)
  
      const Install = require('./install')
      const options =  {
        configFile: filename,
        name: 'slack',
        env: 'uat',
        config: {
        }
      }
  
      expect(() => Install.generate(options)).toThrow('Please specify the slack incoming webhook url')
    })
  
    test('Add the slack output into the configuration file in a specific environment', () => {
        const content = `
---

version: 0.0.1
metadata:
  code: API
  name: My test API
  description: The description of the test api
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
  - name: uat
    plugins:
      - name: restqapi
        config:
          url: http://test.uat.com
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
      `
        filename = `.restqa.yml`
        fs.writeFileSync(filename, content)
  
        const Install = require('./install')
        const options =  {
          name: 'slack',
          env: 'uat',
          configFile: filename,
          config: {
            url: 'https://www.slack-incoming.com/test',
            onlyFailed: false
          }
        }
  
        let result = Install.generate(options)
        result = YAML.parse(result)
  
        const expectedContent = {
          version: '0.0.1',
          metadata: {
            code: 'API',
            name: 'My test API',
            description: 'The description of the test api'
          },
          environments: [{
            name: 'local',
            default: true,
            plugins: [{
              name: 'restqapi',
              config: {
                url: 'http://localhost:3000'
              }
            }],
            outputs: [{
              type: 'file',
              enabled: true,
              config: {
                path: 'my-report.json'
             }
            }]
          }, {
            name: 'uat',
            plugins: [{
              name: 'restqapi',
              config: {
                url: 'http://test.uat.com'
              }
            }],
            outputs: [{
              type: 'file',
              enabled: true,
              config: {
                path: 'my-report.json'
             }
            }, {
              type: 'slack',
              enabled: true,
              config: {
                url: 'https://www.slack-incoming.com/test',
                onlyFailed: false
              }
            }]
          }]
        }
        expect(result).toEqual(expectedContent)
    })
  
    test('Throw an error if the discord config doesn\'t contain the url', () => {
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
  - name: uat
    plugins:
      - name: restqapi
        config:
          url: http://test.uat.com
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
      `
      filename = `/tmp/.restqa.yml`
      fs.writeFileSync(filename, content)
  
      const Install = require('./install')
      const options =  {
        configFile: filename,
        name: 'discord',
        env: 'uat',
        config: {
        }
      }
  
      expect(() => Install.generate(options)).toThrow('Please specify the discord incoming webhook url')
    })
  
    test('Add the discord output into the configuration file in a specific environment', () => {
        const content = `
---

version: 0.0.1
metadata:
  code: API
  name: My test API
  description: The description of the test api
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
  - name: uat
    plugins:
      - name: restqapi
        config:
          url: http://test.uat.com
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
      `
        filename = `.restqa.yml`
        fs.writeFileSync(filename, content)
  
        const Install = require('./install')
        const options =  {
          name: 'discord',
          env: 'local',
          configFile: filename,
          config: {
            url: 'https://www.discord-incoming.com/test',
            onlyFailed: false
          }
        }
  
        let result = Install.generate(options)
        result = YAML.parse(result)
  
        const expectedContent = {
          version: '0.0.1',
          metadata: {
            code: 'API',
            name: 'My test API',
            description: 'The description of the test api'
          },
          environments: [{
            name: 'local',
            default: true,
            plugins: [{
              name: 'restqapi',
              config: {
                url: 'http://localhost:3000'
              }
            }],
            outputs: [{
              type: 'file',
              enabled: true,
              config: {
                path: 'my-report.json'
             }
            }, {
              type: 'discord',
              enabled: true,
              config: {
                url: 'https://www.discord-incoming.com/test',
                onlyFailed: false
              }
            }]
          }, {
            name: 'uat',
            plugins: [{
              name: 'restqapi',
              config: {
                url: 'http://test.uat.com'
              }
            }],
            outputs: [{
              type: 'file',
              enabled: true,
              config: {
                path: 'my-report.json'
             }
            }]
          }]
        }
        expect(result).toEqual(expectedContent)
    })
  })

  describe('Install', () => {

    test('Throw an error if the plugin name is not available', () => {
      const Install = require('./install')
      expect(Install('signal')).rejects.toThrow('The plugin "signal" is not available. Use the command "restqa install" to retrive the list of available plugin')
    })
  
    test('Install slack without passing it as a parameter and when there is multiple environment available', async () => {
        const content = `
---

version: 0.0.1
metadata:
  code: API
  name: My test API
  description: The description of the test api
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
  - name: uat
    plugins:
      - name: restqapi
        config:
          url: http://test.uat.com
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
      `
        filename = `.restqa.yml`
        fs.writeFileSync(filename, content)

        const mockLogger = {
          info: jest.fn(),
          log: jest.fn(),
          success: jest.fn()
        }

        jest.mock('../utils/logger', () => {
          return mockLogger
        })


        const mockPrompt = jest.fn()
          .mockResolvedValueOnce({
            name: 'slack',
          })
          .mockResolvedValue({
            env: 'uat',
            configFile: filename,
            config_url:'https://www.slack-incoming.com/test'
          })

        jest.mock('inquirer', () => {
          return {
            Separator: jest.fn(),
            prompt: mockPrompt
          }
        })
  
        const Install = require('./install')
        await Install()

        expect(mockPrompt.mock.calls.length).toBe(2)
        expect(mockPrompt.mock.calls[0][0][0].message).toEqual('What do you want to install?')
        expect(mockPrompt.mock.calls[0][0][0].name).toEqual('name')
        const expectedPlugins = [
          {
            name: 'slack (outputs)',
            value: 'slack'
          },{
            name: 'discord (outputs)',
            value: 'discord'
          }
        ]
        expect(mockPrompt.mock.calls[0][0][0].choices).toEqual(expectedPlugins)
        
        expect(mockPrompt.mock.calls[1][0][0].message).toEqual('On which environment would you like to install the "slack" outputs?')
        expect(mockPrompt.mock.calls[1][0][0].choices).toEqual(['local', 'uat'])
        expect(mockPrompt.mock.calls[1][0][0].name).toEqual('env')

        expect(mockPrompt.mock.calls[1][0][1].message).toEqual('What is the slack incoming webhook url?')
        expect(mockPrompt.mock.calls[1][0][1].name).toEqual('config_url')
  
        
        let result = YAML.parse(fs.readFileSync(filename).toString('utf-8'))
  
        const expectedContent = {
          version: '0.0.1',
          metadata: {
            code: 'API',
            name: 'My test API',
            description: 'The description of the test api'
          },
          environments: [{
            name: 'local',
            default: true,
            plugins: [{
              name: 'restqapi',
              config: {
                url: 'http://localhost:3000'
              }
            }],
            outputs: [{
              type: 'file',
              enabled: true,
              config: {
                path: 'my-report.json'
             }
            }]
          }, {
            name: 'uat',
            plugins: [{
              name: 'restqapi',
              config: {
                url: 'http://test.uat.com'
              }
            }],
            outputs: [{
              type: 'file',
              enabled: true,
              config: {
                path: 'my-report.json'
             }
            }, {
              type: 'slack',
              enabled: true,
              config: {
                url: 'https://www.slack-incoming.com/test',
                onlyFailed: false
              }
            }]
          }]
        }
        expect(result).toEqual(expectedContent)

        expect(mockLogger.success.mock.calls.length).toBe(1)
        expect(mockLogger.success.mock.calls[0][0]).toEqual('The "slack" outputs has been configured successfully')
        expect(mockLogger.info.mock.calls.length).toBe(1)
        expect(mockLogger.info.mock.calls[0][0]).toEqual('Do not forget to use environment variable to secure your sensitive information')
    })

    test('Install slack when there is multiple environment available', async () => {
        const content = `
---

version: 0.0.1
metadata:
  code: API
  name: My test API
  description: The description of the test api
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
  - name: uat
    plugins:
      - name: restqapi
        config:
          url: http://test.uat.com
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
      `
        filename = `.restqa.yml`
        fs.writeFileSync(filename, content)

        const mockLogger = {
          info: jest.fn(),
          log: jest.fn(),
          success: jest.fn()
        }

        jest.mock('../utils/logger', () => {
          return mockLogger
        })

        const mockPrompt = jest.fn().mockResolvedValue({
          env: 'uat',
          configFile: filename,
          config_url:'https://www.slack-incoming.com/test',
          onlyFailed: false
        })

        jest.mock('inquirer', () => {
          return {
            Separator: jest.fn(),
            prompt: mockPrompt
          }
        })
  
        const Install = require('./install')
        await Install('slack')

        expect(mockPrompt.mock.calls.length).toBe(1)
        expect(mockPrompt.mock.calls[0][0][0].message).toEqual('On which environment would you like to install the "slack" outputs?')
        expect(mockPrompt.mock.calls[0][0][0].choices).toEqual(['local', 'uat'])
        expect(mockPrompt.mock.calls[0][0][0].name).toEqual('env')

        expect(mockPrompt.mock.calls[0][0][1].message).toEqual('What is the slack incoming webhook url?')
        expect(mockPrompt.mock.calls[0][0][1].name).toEqual('config_url')
        
        let result = YAML.parse(fs.readFileSync(filename).toString('utf-8'))
  
        const expectedContent = {
          version: '0.0.1',
          metadata: {
            code: 'API',
            name: 'My test API',
            description: 'The description of the test api'
          },
          environments: [{
            name: 'local',
            default: true,
            plugins: [{
              name: 'restqapi',
              config: {
                url: 'http://localhost:3000'
              }
            }],
            outputs: [{
              type: 'file',
              enabled: true,
              config: {
                path: 'my-report.json'
             }
            }]
          }, {
            name: 'uat',
            plugins: [{
              name: 'restqapi',
              config: {
                url: 'http://test.uat.com'
              }
            }],
            outputs: [{
              type: 'file',
              enabled: true,
              config: {
                path: 'my-report.json'
             }
            }, {
              type: 'slack',
              enabled: true,
              config: {
                url: 'https://www.slack-incoming.com/test',
                onlyFailed: false
              }
            }]
          }]
        }
        expect(result).toEqual(expectedContent)

        expect(mockLogger.success.mock.calls.length).toBe(1)
        expect(mockLogger.success.mock.calls[0][0]).toEqual('The "slack" outputs has been configured successfully')
        expect(mockLogger.info.mock.calls.length).toBe(1)
        expect(mockLogger.info.mock.calls[0][0]).toEqual('Do not forget to use environment variable to secure your sensitive information')
    })

    test('Install slack when there is only one environment available', async () => {
        const content = `
---

version: 0.0.1
metadata:
  code: API
  name: My test API
  description: The description of the test api
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
        filename = `.restqa.yml`
        fs.writeFileSync(filename, content)

        const mockLogger = {
          info: jest.fn(),
          log: jest.fn(),
          success: jest.fn()
        }

        jest.mock('../utils/logger', () => {
          return mockLogger
        })

        const mockPrompt = jest.fn().mockResolvedValue({
          configFile: filename,
          config_url:'https://www.slack-incoming.com/test',
          onlyFailed: false
        })

        jest.mock('inquirer', () => {
          return {
            Separator: jest.fn(),
            prompt: mockPrompt
          }
        })
  
        const Install = require('./install')
        await Install('slack')

        expect(mockPrompt.mock.calls.length).toBe(1)

        expect(mockPrompt.mock.calls[0][0][0].message).toEqual('What is the slack incoming webhook url?')
        expect(mockPrompt.mock.calls[0][0][0].name).toEqual('config_url')
  
        
        let result = YAML.parse(fs.readFileSync(filename).toString('utf-8'))
  
        const expectedContent = {
          version: '0.0.1',
          metadata: {
            code: 'API',
            name: 'My test API',
            description: 'The description of the test api'
          },
          environments: [{
            name: 'local',
            default: true,
            plugins: [{
              name: 'restqapi',
              config: {
                url: 'http://localhost:3000'
              }
            }],
            outputs: [{
              type: 'file',
              enabled: true,
              config: {
                path: 'my-report.json'
             }
            }, {
              type: 'slack',
              enabled: true,
              config: {
                url: 'https://www.slack-incoming.com/test',
                onlyFailed: false
              }
            }]
          }]
        }
        expect(result).toEqual(expectedContent)

        expect(mockLogger.success.mock.calls.length).toBe(1)
        expect(mockLogger.success.mock.calls[0][0]).toEqual('The "slack" outputs has been configured successfully')

        expect(mockLogger.info.mock.calls.length).toBe(1)
        expect(mockLogger.info.mock.calls[0][0]).toEqual('Do not forget to use environment variable to secure your sensitive information')
    })

    test('Install slack when there is only one environment available', async () => {
        const content = `
---

version: 0.0.1
metadata:
  code: API
  name: My test API
  description: The description of the test api
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
        filename = `.restqa.yml`
        fs.writeFileSync(filename, content)

        const mockLogger = {
          info: jest.fn(),
          log: jest.fn(),
          success: jest.fn()
        }

        jest.mock('../utils/logger', () => {
          return mockLogger
        })

        const mockPrompt = jest.fn().mockResolvedValue({
          configFile: filename,
          config_url:'https://www.discord-incoming.com/test',
          onlyFailed: false
        })

        jest.mock('inquirer', () => {
          return {
            Separator: jest.fn(),
            prompt: mockPrompt
          }
        })
  
        const Install = require('./install')
        await Install('discord')

        expect(mockPrompt.mock.calls.length).toBe(1)

        expect(mockPrompt.mock.calls[0][0][0].message).toEqual('What is the discord incoming webhook url?')
        expect(mockPrompt.mock.calls[0][0][0].name).toEqual('config_url')
        
        let result = YAML.parse(fs.readFileSync(filename).toString('utf-8'))
  
        const expectedContent = {
          version: '0.0.1',
          metadata: {
            code: 'API',
            name: 'My test API',
            description: 'The description of the test api'
          },
          environments: [{
            name: 'local',
            default: true,
            plugins: [{
              name: 'restqapi',
              config: {
                url: 'http://localhost:3000'
              }
            }],
            outputs: [{
              type: 'file',
              enabled: true,
              config: {
                path: 'my-report.json'
             }
            }, {
              type: 'discord',
              enabled: true,
              config: {
                url: 'https://www.discord-incoming.com/test',
                onlyFailed: false
              }
            }]
          }]
        }
        expect(result).toEqual(expectedContent)

        expect(mockLogger.success.mock.calls.length).toBe(1)
        expect(mockLogger.success.mock.calls[0][0]).toEqual('The "discord" outputs has been configured successfully')

        expect(mockLogger.info.mock.calls.length).toBe(1)
        expect(mockLogger.info.mock.calls[0][0]).toEqual('Do not forget to use environment variable to secure your sensitive information')
    })
  })
})
