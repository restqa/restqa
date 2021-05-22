process.setMaxListeners(Infinity)

const fs = require('fs')
const YAML = require('yaml')
const os = require('os')

const jestqa = new JestQA(__filename, true)

beforeEach(jestqa.beforeEach)
afterEach(jestqa.afterEach)

describe('#Cli - install', () => {
  describe('generate', () => {
    test('Throw an error if the plugin name is not available', () => {
      const Install = require('./install')
      const options = {
        name: 'signal'
      }

      expect(() => Install.generate(options)).toThrow('The plugin "signal" is not available')
    })

    test('Throw an error if the environement is not defined', () => {
      const Install = require('./install')
      const options = {
        name: 'slack'
      }

      expect(() => Install.generate(options)).toThrow('Please specify the target environment')
    })

    test('Throw an error if configFile is not defined', () => {
      const Install = require('./install')
      const options = {
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
        env: 'prod'
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
      const filename = jestqa.createTmpFile(content, '.restqa.yml')

      const Install = require('./install')
      const options = {
        configFile: filename,
        name: 'slack',
        env: 'prod'
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
      const filename = jestqa.createTmpFile(content, '.restqa.yml')

      const Install = require('./install')
      const options = {
        configFile: filename,
        name: 'slack',
        env: 'uat',
        config: {
        }
      }

      expect(() => Install.generate(options)).toThrow('Please specify the slack incoming webhook url')
    })

    test('Add the slack output into the configuration file in a specific environment (and the output object doesn\'t exist', () => {
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
      `
      const filename = jestqa.createTmpFile(content, '.restqa.yml')

      const Install = require('./install')
      const options = {
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
      const filename = jestqa.createTmpFile(content, '.restqa.yml')

      const Install = require('./install')
      const options = {
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

      const filename = jestqa.createTmpFile(content, '.restqa.yml')

      const Install = require('./install')
      const options = {
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
      const filename = jestqa.createTmpFile(content, '.restqa.yml')

      const Install = require('./install')
      const options = {
        name: 'excel',
        env: 'local',
        configFile: filename,
        config: {
          folder: os.tmpdir()
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
              folder: os.tmpdir()
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
      const filename = jestqa.createTmpFile(content, '.restqa.yml')

      const Install = require('./install')
      const options = {
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

      const filename = jestqa.createTmpFile(content, '.restqa.yml')

      const Install = require('./install')
      const options = {
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
      const filename = jestqa.createTmpFile(content, '.restqa.yml')

      const Install = require('./install')
      const options = {
        name: 'google-sheet',
        env: 'local',
        configFile: filename,
        config: {
          id: 'fake-id',
          apikey: 'fake-apikey'
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

    test('Throw an error if the line config doesn\'t contain the token', () => {
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
      const filename = jestqa.createTmpFile(content, '.restqa.yml')

      const Install = require('./install')
      const options = {
        configFile: filename,
        name: 'line',
        env: 'uat',
        config: {
        }
      }

      expect(() => Install.generate(options)).toThrow('Please specify the Line notification token')
    })

    test('Add the Line output into the configuration file in a specific environment', () => {
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
      const filename = jestqa.createTmpFile(content, '.restqa.yml')

      const Install = require('./install')
      const options = {
        name: 'line',
        env: 'local',
        configFile: filename,
        config: {
          token: 'xxx-yyy-zzz',
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
            type: 'line',
            enabled: true,
            config: {
              token: 'xxx-yyy-zzz',
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

    test('Throw an error if the wehoook config doesn\'t contain url', () => {
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
      const filename = jestqa.createTmpFile(content, '.restqa.yml')

      const Install = require('./install')
      const options = {
        configFile: filename,
        name: 'webhook',
        env: 'uat',
        config: {
        }
      }

      expect(() => Install.generate(options)).toThrow('Please specify the Webhook url')
    })

    test('Add the webhook output into the configuration file in a specific environment', () => {
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
      const filename = jestqa.createTmpFile(content, '.restqa.yml')

      const Install = require('./install')
      const options = {
        name: 'webhook',
        env: 'local',
        configFile: filename,
        config: {
          url: 'https://webhook-example.com'
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
            type: 'webhook',
            enabled: true,
            config: {
              url: 'https://webhook-example.com'
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
      const filename = jestqa.createTmpFile(content, '.restqa.yml')

      const Install = require('./install')
      const options = {
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
      const filename = jestqa.createTmpFile(content, '.restqa.yml')

      const Install = require('./install')
      const options = {
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

    test('Add the http-html-report output into the configuration file in a specific environment', () => {
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
      const filename = jestqa.createTmpFile(content, '.restqa.yml')

      const Install = require('./install')
      const options = {
        name: 'http-html-report',
        env: 'local',
        configFile: filename
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
            type: 'http-html-report',
            enabled: true
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

    test('Add the html output into the configuration file in a specific environment', () => {
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
      const filename = jestqa.createTmpFile(content, '.restqa.yml')

      const Install = require('./install')
      const options = {
        name: 'html',
        env: 'local',
        configFile: filename
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
            type: 'html',
            enabled: true
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

    test('Add the file output into the configuration file in a specific environment', () => {
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
      const filename = jestqa.createCwdConfig(content)

      const Install = require('./install')
      const options = {
        name: 'file',
        env: 'local',
        configFile: filename
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
            type: 'file',
            enabled: true
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
      return expect(Install('signal')).rejects.toThrow('The plugin "signal" is not available. Use the command "restqa install" to retrive the list of available plugin')
    })

    test('Throw an error if the environemt passed name is not available in the configuration file', () => {
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
      const filename = jestqa.createCwdConfig(content)
      const mockPrompt = jest.fn()
        .mockResolvedValueOnce({
          name: 'slack'
        })
        .mockResolvedValue({
          env: 'uat',
          configFile: filename,
          config_url: 'https://www.slack-incoming.com/test'
        })

      const MockSeparator = jest.fn()

      jest.mock('inquirer', () => {
        return {
          Separator: MockSeparator,
          prompt: mockPrompt
        }
      })
      const Install = require('./install')
      const opt = {
        env: 'testing'
      }
      return expect(Install('slack', opt)).rejects.toThrow('"testing" is not an environment available in the config file, choose between : local, uat')
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
      const filename = jestqa.createCwdConfig(content)

      const mockPrompt = jest.fn()
        .mockResolvedValueOnce({
          name: 'slack'
        })
        .mockResolvedValue({
          env: 'uat',
          configFile: filename,
          config_url: 'https://www.slack-incoming.com/test'
        })

      const MockSeparator = jest.fn()

      jest.mock('inquirer', () => {
        return {
          Separator: MockSeparator,
          prompt: mockPrompt
        }
      })

      const Install = require('./install')
      await Install()

      expect(mockPrompt.mock.calls).toHaveLength(2)
      expect(mockPrompt.mock.calls[0][0][0].message).toEqual('What do you want to install?')
      expect(mockPrompt.mock.calls[0][0][0].name).toEqual('name')
      const expectedPlugins = [
        {
          name: 'Slack (outputs)',
          value: 'slack'
        }, {
          name: 'Discord (outputs)',
          value: 'discord'
        }, {
          name: 'Line (outputs)',
          value: 'line'
        }, {
          name: 'Webhook (outputs)',
          value: 'webhook'
        }, {
          name: 'Html (outputs)',
          value: 'html'
        }, {
          name: 'File (outputs)',
          value: 'file'
        }, {
          name: 'Http-html-report (outputs)',
          value: 'http-html-report'
        },
        new MockSeparator(),
        {
          name: 'Excel (data)',
          value: 'excel'
        }, {
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

      const result = YAML.parse(fs.readFileSync(filename).toString('utf-8'))

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

      expect(jestqa.getLoggerMock()).toHaveBeenCalledTimes(2)
      expect(jestqa.getLoggerMock().mock.calls[0][0]).toMatch('The "slack" outputs addon has been configured successfully')
      expect(jestqa.getLoggerMock().mock.calls[1][0]).toMatch('Do not forget to use environment variable to secure your sensitive information')
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
      const filename = jestqa.createCwdConfig(content)

      const mockPrompt = jest.fn().mockResolvedValue({
        env: 'uat',
        configFile: filename,
        config_url: 'https://www.slack-incoming.com/test',
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

      expect(mockPrompt.mock.calls).toHaveLength(1)
      expect(mockPrompt.mock.calls[0][0][0].message).toEqual('On which environment would you like to install the "slack" outputs?')
      expect(mockPrompt.mock.calls[0][0][0].choices).toEqual(['local', 'uat'])
      expect(mockPrompt.mock.calls[0][0][0].name).toEqual('env')

      expect(mockPrompt.mock.calls[0][0][1].message).toEqual('What is the slack incoming webhook url?')
      expect(mockPrompt.mock.calls[0][0][1].name).toEqual('config_url')

      const result = YAML.parse(fs.readFileSync(filename).toString('utf-8'))

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

      expect(jestqa.getLoggerMock()).toHaveBeenCalledTimes(2)
      expect(jestqa.getLoggerMock().mock.calls[0][0]).toMatch('The "slack" outputs addon has been configured successfully')
      expect(jestqa.getLoggerMock().mock.calls[1][0]).toMatch('Do not forget to use environment variable to secure your sensitive information')
    })

    test('Install slack when there is multiple environment available but the environement is passed', async () => {
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
      const filename = jestqa.createCwdConfig(content)
      const mockPrompt = jest.fn().mockResolvedValue({
        configFile: filename,
        config_url: 'https://www.slack-incoming.com/test',
        onlyFailed: false
      })

      jest.mock('inquirer', () => {
        return {
          Separator: jest.fn(),
          prompt: mockPrompt
        }
      })

      const Install = require('./install')
      const opt = {
        env: 'uat'
      }
      await Install('slack', opt)

      expect(mockPrompt.mock.calls).toHaveLength(1)

      expect(mockPrompt.mock.calls[0][0][0].message).toEqual('What is the slack incoming webhook url?')
      expect(mockPrompt.mock.calls[0][0][0].name).toEqual('config_url')

      const result = YAML.parse(fs.readFileSync(filename).toString('utf-8'))

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

      expect(jestqa.getLoggerMock()).toHaveBeenCalledTimes(2)
      expect(jestqa.getLoggerMock().mock.calls[0][0]).toMatch('The "slack" outputs addon has been configured successfully')
      expect(jestqa.getLoggerMock().mock.calls[1][0]).toMatch('Do not forget to use environment variable to secure your sensitive information')
    })

    test('Install slack when there is only one environment available but specify the configuration file', async () => {
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
      const filename = jestqa.createCwdConfig(content)

      const mockPrompt = jest.fn().mockResolvedValue({
        configFile: filename,
        config_url: 'https://www.slack-incoming.com/test',
        onlyFailed: false
      })

      jest.mock('inquirer', () => {
        return {
          Separator: jest.fn(),
          prompt: mockPrompt
        }
      })

      const Install = require('./install')
      const opt = {
        config: filename
      }
      await Install('slack', opt)

      expect(mockPrompt.mock.calls).toHaveLength(1)

      expect(mockPrompt.mock.calls[0][0][0].message).toEqual('What is the slack incoming webhook url?')
      expect(mockPrompt.mock.calls[0][0][0].name).toEqual('config_url')

      const result = YAML.parse(fs.readFileSync(filename).toString('utf-8'))

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

      expect(jestqa.getLoggerMock()).toHaveBeenCalledTimes(2)
      expect(jestqa.getLoggerMock().mock.calls[0][0]).toMatch('The "slack" outputs addon has been configured successfully')
      expect(jestqa.getLoggerMock().mock.calls[1][0]).toMatch('Do not forget to use environment variable to secure your sensitive information')
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
      const filename = jestqa.createCwdConfig(content)

      const mockPrompt = jest.fn().mockResolvedValue({
        configFile: filename,
        config_url: 'https://www.discord-incoming.com/test',
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

      expect(mockPrompt.mock.calls).toHaveLength(1)

      expect(mockPrompt.mock.calls[0][0][0].message).toEqual('What is the discord incoming webhook url?')
      expect(mockPrompt.mock.calls[0][0][0].name).toEqual('config_url')

      const result = YAML.parse(fs.readFileSync(filename).toString('utf-8'))

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

      expect(jestqa.getLoggerMock()).toHaveBeenCalledTimes(2)
      expect(jestqa.getLoggerMock().mock.calls[0][0]).toMatch('The "discord" outputs addon has been configured successfully')
      expect(jestqa.getLoggerMock().mock.calls[1][0]).toMatch('Do not forget to use environment variable to secure your sensitive information')
    })

    test('Install html when there is only one environment available', async () => {
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
      const filename = jestqa.createCwdConfig(content)

      const mockPrompt = jest.fn().mockResolvedValue({
        configFile: filename
      })

      jest.mock('inquirer', () => {
        return {
          Separator: jest.fn(),
          prompt: mockPrompt
        }
      })

      const Install = require('./install')
      await Install('html')

      expect(mockPrompt.mock.calls).toHaveLength(1)

      expect(mockPrompt.mock.calls[0][0]).toHaveLength(0)

      const result = YAML.parse(fs.readFileSync(filename).toString('utf-8'))

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
            type: 'html',
            enabled: true
          }]
        }]
      }
      expect(result).toEqual(expectedContent)

      expect(jestqa.getLoggerMock()).toHaveBeenCalledTimes(2)
      expect(jestqa.getLoggerMock().mock.calls[0][0]).toMatch('The "html" outputs addon has been configured successfully')
      expect(jestqa.getLoggerMock().mock.calls[1][0]).toMatch('Do not forget to use environment variable to secure your sensitive information')
    })

    test('Install file when there is only one environment available', async () => {
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
      const filename = jestqa.createCwdConfig(content)

      const mockPrompt = jest.fn().mockResolvedValue({
        configFile: filename
      })

      jest.mock('inquirer', () => {
        return {
          Separator: jest.fn(),
          prompt: mockPrompt
        }
      })

      const Install = require('./install')
      await Install('file')

      expect(mockPrompt.mock.calls).toHaveLength(1)

      expect(mockPrompt.mock.calls[0][0]).toHaveLength(0)

      const result = YAML.parse(fs.readFileSync(filename).toString('utf-8'))

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
            type: 'file',
            enabled: true
          }]
        }]
      }
      expect(result).toEqual(expectedContent)

      expect(jestqa.getLoggerMock()).toHaveBeenCalledTimes(2)
      expect(jestqa.getLoggerMock().mock.calls[0][0]).toMatch('The "file" outputs addon has been configured successfully')
      expect(jestqa.getLoggerMock().mock.calls[1][0]).toMatch('Do not forget to use environment variable to secure your sensitive information')
    })

    test('Install http-html-report when there is only one environment available', async () => {
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
      const filename = jestqa.createCwdConfig(content, '.restqa.yml')

      const mockPrompt = jest.fn().mockResolvedValue({
        configFile: filename
      })

      jest.mock('inquirer', () => {
        return {
          Separator: jest.fn(),
          prompt: mockPrompt
        }
      })

      const Install = require('./install')
      await Install('http-html-report')

      expect(mockPrompt.mock.calls).toHaveLength(1)

      expect(mockPrompt.mock.calls[0][0]).toHaveLength(0)

      const result = YAML.parse(fs.readFileSync(filename).toString('utf-8'))

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
            type: 'http-html-report',
            enabled: true
          }]
        }]
      }
      expect(result).toEqual(expectedContent)

      expect(jestqa.getLoggerMock()).toHaveBeenCalledTimes(2)
      expect(jestqa.getLoggerMock().mock.calls[0][0]).toMatch('The "http-html-report" outputs addon has been configured successfully')
      expect(jestqa.getLoggerMock().mock.calls[1][0]).toMatch('Do not forget to use environment variable to secure your sensitive information')
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
      const filename = jestqa.createCwdConfig(content)

      const mockPrompt = jest.fn().mockResolvedValue({
        configFile: filename,
        config_folder: os.tmpdir()
      })

      jest.mock('inquirer', () => {
        return {
          Separator: jest.fn(),
          prompt: mockPrompt
        }
      })

      const Install = require('./install')
      await Install('excel')

      expect(mockPrompt.mock.calls).toHaveLength(1)

      expect(mockPrompt.mock.calls[0][0][0].message).toEqual('Where are located your csv files ?')
      expect(mockPrompt.mock.calls[0][0][0].name).toEqual('config_folder')

      const result = YAML.parse(fs.readFileSync(filename).toString('utf-8'))

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
              folder: os.tmpdir()
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

      expect(jestqa.getLoggerMock()).toHaveBeenCalledTimes(2)
      expect(jestqa.getLoggerMock().mock.calls[0][0]).toMatch('The "excel" data addon has been configured successfully')
      expect(jestqa.getLoggerMock().mock.calls[1][0]).toMatch('Do not forget to use environment variable to secure your sensitive information')
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
      const filename = jestqa.createCwdConfig(content, '.restqa.yml')

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

      expect(mockPrompt.mock.calls).toHaveLength(1)

      expect(mockPrompt.mock.calls[0][0][0].message).toEqual('What is your Google Sheet id?')
      expect(mockPrompt.mock.calls[0][0][0].name).toEqual('config_id')

      expect(mockPrompt.mock.calls[0][0][1].message).toEqual('What is your Google Sheet api key?')
      expect(mockPrompt.mock.calls[0][0][1].name).toEqual('config_apikey')

      const result = YAML.parse(fs.readFileSync(filename).toString('utf-8'))

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

      expect(jestqa.getLoggerMock()).toHaveBeenCalledTimes(2)
      expect(jestqa.getLoggerMock().mock.calls[0][0]).toMatch('The "google-sheet" data addon has been configured successfully')
      expect(jestqa.getLoggerMock().mock.calls[1][0]).toMatch('Do not forget to use environment variable to secure your sensitive information')
    })

    test('Install line when there is only one environment available', async () => {
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
      const filename = jestqa.createCwdConfig(content, '.restqa.yml')

      const mockPrompt = jest.fn().mockResolvedValue({
        configFile: filename,
        config_token: 'xxx-yyy-zzz'
      })

      jest.mock('inquirer', () => {
        return {
          Separator: jest.fn(),
          prompt: mockPrompt
        }
      })

      const Install = require('./install')
      await Install('line')

      expect(mockPrompt.mock.calls).toHaveLength(1)

      expect(mockPrompt.mock.calls[0][0][0].message).toEqual('What is the notification Line Messenger token?')
      expect(mockPrompt.mock.calls[0][0][0].name).toEqual('config_token')

      const result = YAML.parse(fs.readFileSync(filename).toString('utf-8'))

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
            type: 'line',
            enabled: true,
            config: {
              token: 'xxx-yyy-zzz',
              onlyFailed: false
            }
          }]
        }]
      }
      expect(result).toEqual(expectedContent)

      expect(jestqa.getLoggerMock()).toHaveBeenCalledTimes(2)
      expect(jestqa.getLoggerMock().mock.calls[0][0]).toMatch('The "line" outputs addon has been configured successfully')
      expect(jestqa.getLoggerMock().mock.calls[1][0]).toMatch('Do not forget to use environment variable to secure your sensitive information')
    })

    test('Install Webhook when there is only one environment available', async () => {
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
      const filename = jestqa.createCwdConfig(content, '.restqa.yml')

      const mockPrompt = jest.fn().mockResolvedValue({
        configFile: filename,
        config_url: 'https://example-webhook.com'
      })

      jest.mock('inquirer', () => {
        return {
          Separator: jest.fn(),
          prompt: mockPrompt
        }
      })

      const Install = require('./install')
      await Install('webhook')

      expect(mockPrompt.mock.calls).toHaveLength(1)

      expect(mockPrompt.mock.calls[0][0][0].message).toEqual('What is the Webhook url?')
      expect(mockPrompt.mock.calls[0][0][0].name).toEqual('config_url')

      const result = YAML.parse(fs.readFileSync(filename).toString('utf-8'))

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
            type: 'webhook',
            enabled: true,
            config: {
              url: 'https://example-webhook.com'
            }
          }]
        }]
      }
      expect(result).toEqual(expectedContent)

      expect(jestqa.getLoggerMock()).toHaveBeenCalledTimes(2)
      expect(jestqa.getLoggerMock().mock.calls[0][0]).toMatch('The "webhook" outputs addon has been configured successfully')
      expect(jestqa.getLoggerMock().mock.calls[1][0]).toMatch('Do not forget to use environment variable to secure your sensitive information')
    })
  })
})
