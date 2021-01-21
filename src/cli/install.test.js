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

    test('Throw an error if the excel config doesn\'t contain the folder', () => {
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
        name: 'excel',
        env: 'uat',
        config: {
        }
      }
  
      expect(() => Install.generate(options)).toThrow('Please specify the location of your csv files (data.config.folder)')
    })

    test('Throw an error if the excel config contains a folder but he doesn\'t exist', () => {
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
        name: 'excel',
        env: 'uat',
        config: {
          folder: '/fake_folder'
        }
      }
      expect(() => Install.generate(options)).toThrow('The folder "/fake_folder" doesn\'t exist.')
    })
  
    test('Add the excel data into the configuration file in a specific environment', () => {
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
          name: 'excel',
          env: 'local',
          configFile: filename,
          config: {
            folder: '/tmp',
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
            data: {
              channel: 'csv',
              config: {
                folder: '/tmp'
              }
            },
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
            }]
          }]
        }
        expect(result).toEqual(expectedContent)
    })

    test('Throw an error if the google-sheet config doesn\'t contain the google sheet id', () => {
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
        name: 'google-sheet',
        env: 'uat',
        config: {
        }
      }
  
      expect(() => Install.generate(options)).toThrow('Please specify the google sheet id (data.config.id)')
    })

    test('Throw an error if the google-sheet config doesn\'t contain the google api key', () => {
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
        name: 'google-sheet',
        env: 'uat',
        config: {
          id: 'fake-id'
        }
      }
      expect(() => Install.generate(options)).toThrow('Please specify the google sheet api key (data.config.apikey)')
    })
  
    test('Add the google sheet data into the configuration file in a specific environment', () => {
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
          name: 'google-sheet',
          env: 'local',
          configFile: filename,
          config: {
            id: 'fake-id',
            apikey: 'fake-apikey',
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
            data: {
              channel: 'google-sheet',
              config: {
                id: 'fake-id',
                apikey: 'fake-apikey'
              }
            },
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

        const mockSeparator = jest.fn()

        jest.mock('inquirer', () => {
          return {
            Separator: mockSeparator,
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
            name: 'Slack (outputs)',
            value: 'slack'
          },{
            name: 'Discord (outputs)',
            value: 'discord'
          },
         new mockSeparator(),
          {
            name: 'Excel (data)',
            value: 'excel'
          },{
            name: 'Google-sheet (data)',
            value: 'google-sheet'
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
        expect(mockLogger.success.mock.calls[0][0]).toEqual('The "slack" outputs addon has been configured successfully')
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
        expect(mockLogger.success.mock.calls[0][0]).toEqual('The "slack" outputs addon has been configured successfully')
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
        expect(mockLogger.success.mock.calls[0][0]).toEqual('The "slack" outputs addon has been configured successfully')

        expect(mockLogger.info.mock.calls.length).toBe(1)
        expect(mockLogger.info.mock.calls[0][0]).toEqual('Do not forget to use environment variable to secure your sensitive information')
    })

    test('Install discord when there is only one environment available', async () => {
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
        expect(mockLogger.success.mock.calls[0][0]).toEqual('The "discord" outputs addon has been configured successfully')

        expect(mockLogger.info.mock.calls.length).toBe(1)
        expect(mockLogger.info.mock.calls[0][0]).toEqual('Do not forget to use environment variable to secure your sensitive information')
    })

    test('Install excel (CSV) when there is only one environment available', async () => {
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
          config_folder:'/tmp',
        })

        jest.mock('inquirer', () => {
          return {
            Separator: jest.fn(),
            prompt: mockPrompt
          }
        })
  
        const Install = require('./install')
        await Install('excel')

        expect(mockPrompt.mock.calls.length).toBe(1)

        expect(mockPrompt.mock.calls[0][0][0].message).toEqual('Where are located your csv files ?')
        expect(mockPrompt.mock.calls[0][0][0].name).toEqual('config_folder')
        
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
            data: {
              channel: 'csv',
              config: {
                folder: '/tmp'
              }
            },
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
          }]
        }
        expect(result).toEqual(expectedContent)

        expect(mockLogger.success.mock.calls.length).toBe(1)
        expect(mockLogger.success.mock.calls[0][0]).toEqual('The "excel" data addon has been configured successfully')

        expect(mockLogger.info.mock.calls.length).toBe(1)
        expect(mockLogger.info.mock.calls[0][0]).toEqual('Do not forget to use environment variable to secure your sensitive information')
    })

    test('Install google-sheet when there is only one environment available', async () => {
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
          config_id: 'google-sheet-id',
          config_apikey: 'google-sheet-apikey'
        })

        jest.mock('inquirer', () => {
          return {
            Separator: jest.fn(),
            prompt: mockPrompt
          }
        })
  
        const Install = require('./install')
        await Install('google-sheet')

        expect(mockPrompt.mock.calls.length).toBe(1)

        expect(mockPrompt.mock.calls[0][0][0].message).toEqual('What is your Google Sheet id?')
        expect(mockPrompt.mock.calls[0][0][0].name).toEqual('config_id')

        expect(mockPrompt.mock.calls[0][0][1].message).toEqual('What is your Google Sheet api key?')
        expect(mockPrompt.mock.calls[0][0][1].name).toEqual('config_apikey')
        
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
            data: {
              channel: 'google-sheet',
              config: {
                id: 'google-sheet-id',
                apikey: 'google-sheet-apikey'
              }
            },
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
          }]
        }
        expect(result).toEqual(expectedContent)

        expect(mockLogger.success.mock.calls.length).toBe(1)
        expect(mockLogger.success.mock.calls[0][0]).toEqual('The "google-sheet" data addon has been configured successfully')

        expect(mockLogger.info.mock.calls.length).toBe(1)
        expect(mockLogger.info.mock.calls[0][0]).toEqual('Do not forget to use environment variable to secure your sensitive information')
    })
  })
})
