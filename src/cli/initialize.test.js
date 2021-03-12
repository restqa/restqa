process.setMaxListeners(Infinity)

const fs = require('fs')
const path = require('path')
let files = []
let mockGenerator

beforeEach(() => {
  files.forEach(filename => {
    if (filename && fs.existsSync(filename)) {
      fs.unlinkSync(filename)
    }
  })
  files = []

  jest.mock('../utils/logger', () => {
    return {
      info: jest.fn(),
      log: jest.fn(),
      success: jest.fn()
    }
  })
  mockGenerator = jest.fn()
  jest.mock('@restqa/restqapi', () => ({
    Generator: mockGenerator
  }))
})

afterEach(() => {
  jest.resetModules()
  jest.resetAllMocks()

  files.forEach(filename => {
    if (filename && fs.existsSync(filename)) {
      fs.unlinkSync(filename)
    }
  })
})

describe('#Cli - Initialize', () => {
  describe('Genereate', () => {
    test('Throw an error if the CI is not a part of the list', () => {
      const Iniitialize = require('./initialize')
      const options = {
        name: 'sample',
        url: 'http://test.com',
        env: 'test',
        description: 'my description',
        ci: 'GoCd'
      }
      return expect(Iniitialize.generate(options)).rejects.toThrow('The continous integration "GoCd" is not supported by RestQa')
    })

    test('Create Github action file if selected', async () => {
      const filename = path.resolve(process.cwd(), '.github', 'workflows', 'integration-test.yml')
      files.push(filename)

      const mockLogger = {
        info: jest.fn(),
        log: jest.fn(),
        success: jest.fn()
      }

      jest.mock('../utils/logger', () => {
        return mockLogger
      })

      const Iniitialize = require('./initialize')
      const options = {
        name: 'sample',
        url: 'http://test.com',
        env: 'test',
        description: 'my description',
        ci: 'github-action'
      }
      await Iniitialize.generate(options)

      const content = fs.readFileSync(filename).toString('utf-8')
      const YAML = require('yaml')
      const result = YAML.parse(content)
      const expectedContent = {
        name: 'RestQA - Integration tests',
        on: [
          'push'
        ],
        jobs: {
          RestQa: {
            'runs-on': 'ubuntu-latest',
            steps: [{
              uses: 'actions/checkout@v1'
            }, {
              uses: 'restqa/restqa-action@0.0.1',
              with: {
                path: 'tests/'
              }
            }]
          }
        }
      }
      expect(result).toEqual(expectedContent)
      expect(mockLogger.success.mock.calls).toHaveLength(3)

      expect(mockLogger.success.mock.calls[0][0]).toEqual('.restqa.yml file created successfully')
      expect(mockLogger.success.mock.calls[1][0]).toEqual('.github/workflows/integration-test.yml file created successfully')
      expect(mockLogger.success.mock.calls[2][0]).toEqual('tests/integration/welcome-restqa.feature file created successfully')
    })

    test('Create Gitlab-ci file if selected', async () => {
      const filename = path.resolve(process.cwd(), '.gitlab-ci.yml')
      files.push(filename)

      const mockLogger = {
        info: jest.fn(),
        log: jest.fn(),
        success: jest.fn()
      }

      jest.mock('../utils/logger', () => {
        return mockLogger
      })

      const Iniitialize = require('./initialize')
      const options = {
        name: 'sample',
        url: 'http://test.com',
        env: 'test',
        description: 'my description',
        ci: 'gitlab-ci'
      }
      await Iniitialize.generate(options)

      const content = fs.readFileSync(filename).toString('utf-8')
      const YAML = require('yaml')
      const result = YAML.parse(content)

      const expectedContent = {
        stages: [
          'e2e test'
        ],
        RestQa: {
          stage: 'e2e test',
          image: {
            name: 'restqa/restqa'
          },
          script: [
            'restqa run .'
          ]
        }
      }
      expect(result).toEqual(expectedContent)

      expect(mockLogger.success.mock.calls).toHaveLength(3)

      expect(mockLogger.success.mock.calls[0][0]).toEqual('.restqa.yml file created successfully')
      expect(mockLogger.success.mock.calls[1][0]).toEqual('.gitlab-ci.yml file created successfully')
      expect(mockLogger.success.mock.calls[2][0]).toEqual('tests/integration/welcome-restqa.feature file created successfully')
    })

    test('Create Bitbucket pipeline file  if selected', async () => {
      const mockLogger = {
        info: jest.fn(),
        log: jest.fn(),
        success: jest.fn()
      }

      jest.mock('../utils/logger', () => {
        return mockLogger
      })

      const filename = path.resolve(process.cwd(), 'bitbucket-pipelines.yml')
      files.push(filename)
      const Iniitialize = require('./initialize')
      const options = {
        name: 'sample',
        url: 'http://test.com',
        env: 'test',
        description: 'my description',
        ci: 'bitbucket-pipeline'
      }
      await Iniitialize.generate(options)

      const content = fs.readFileSync(filename).toString('utf-8')
      const YAML = require('yaml')
      const result = YAML.parse(content)

      const expectedContent = {
        pipelines: {
          default: [{
            step: {
              image: 'restqa/restqa',
              script: [
                'restqa run .'
              ]
            }
          }]
        }
      }
      expect(result).toEqual(expectedContent)
      expect(mockLogger.success.mock.calls).toHaveLength(3)

      expect(mockLogger.success.mock.calls[0][0]).toEqual('.restqa.yml file created successfully')
      expect(mockLogger.success.mock.calls[1][0]).toEqual('bitbucket-pipelines.yml file created successfully')
      expect(mockLogger.success.mock.calls[2][0]).toEqual('tests/integration/welcome-restqa.feature file created successfully')
    })

    test('Create Circle-ci pipeline file if selected', async () => {
      const mockLogger = {
        info: jest.fn(),
        log: jest.fn(),
        success: jest.fn()
      }

      jest.mock('../utils/logger', () => {
        return mockLogger
      })

      const filename = path.resolve(process.cwd(), '.circleci/config.yml')
      files.push(filename)
      const Iniitialize = require('./initialize')
      const options = {
        name: 'sample',
        url: 'http://test.com',
        env: 'test',
        description: 'my description',
        ci: 'circle-ci'
      }
      await Iniitialize.generate(options)

      const content = fs.readFileSync(filename).toString('utf-8')
      const YAML = require('yaml')
      const result = YAML.parse(content)

      const expectedContent = {
        version: 2.1,
        jobs: {
          test: {
            docker: [
              {
                image: 'restqa/restqa'
              }
            ],
            steps: [
              'checkout',
              {
                run: {
                  name: 'Run RestQA integration test',
                  command: 'restqa run'
                }
              },
              {
                store_artifacts: {
                  path: 'report'
                }
              }
            ]
          }
        },
        workflows: {
          version: 2,
          restqa: {
            jobs: [
              'test'
            ]
          }
        }
      }

      expect(result).toEqual(expectedContent)
      expect(mockLogger.success.mock.calls).toHaveLength(3)

      expect(mockLogger.success.mock.calls[0][0]).toEqual('.restqa.yml file created successfully')
      expect(mockLogger.success.mock.calls[1][0]).toEqual('.circleci/config.yml file created successfully')
      expect(mockLogger.success.mock.calls[2][0]).toEqual('tests/integration/welcome-restqa.feature file created successfully')
    })

    test('Do nothing if any CI hasn\'t been selected', async () => {
      const Iniitialize = require('./initialize')
      const options = {
        name: 'sample',
        url: 'http://test.com',
        env: 'test',
        description: 'my description',
        ci: false
      }
      await Iniitialize.generate(options)

      let filename = path.resolve(process.cwd(), 'bitbucket-pipelines.yml')
      expect(fs.existsSync(filename)).toBe(false)
      filename = path.resolve(process.cwd(), '.gitlab-ci.yml')
      expect(fs.existsSync(filename)).toBe(false)
      filename = path.resolve(process.cwd(), '.github', 'workflows', 'integration-test.yml')
      expect(fs.existsSync(filename)).toBe(false)
      filename = path.resolve(process.cwd(), 'circleci', 'config.yml')
      expect(fs.existsSync(filename)).toBe(false)
    })

    test('Do nothing if any CI hasn\'t  been answered', async () => {
      const Iniitialize = require('./initialize')
      const options = {
        name: 'sample',
        url: 'http://test.com',
        env: 'test',
        description: 'my description'
      }
      await Iniitialize.generate(options)

      let filename = path.resolve(process.cwd(), 'bitbucket-pipelines.yml')
      expect(fs.existsSync(filename)).toBe(false)
      filename = path.resolve(process.cwd(), '.gitlab-ci.yml')
      expect(fs.existsSync(filename)).toBe(false)
      filename = path.resolve(process.cwd(), '.github', 'workflows', 'integration-test.yml')
      expect(fs.existsSync(filename)).toBe(false)
      filename = path.resolve(process.cwd(), 'circleci', 'config.yml')
      expect(fs.existsSync(filename)).toBe(false)
    })

    describe('restqa configuration file and welcome scenario', () => {
      test('Throw an error if the name is not defined', () => {
        const Iniitialize = require('./initialize')
        const options = {}
        return expect(Iniitialize.generate(options)).rejects.toThrow('Please share a project name.')
      })

      test('Throw an error if the description is not defined', () => {
        const Iniitialize = require('./initialize')
        const options = {
          name: 'sample'
        }
        return expect(Iniitialize.generate(options)).rejects.toThrow('Please share a project description.')
      })

      test('Throw an error if the url is not defined', () => {
        const Iniitialize = require('./initialize')
        const options = {
          name: 'sample',
          description: 'here a description'
        }
        return expect(Iniitialize.generate(options)).rejects.toThrow('Please share a project url.')
      })

      test('Throw an error if the environement is not defined', () => {
        const Iniitialize = require('./initialize')
        const options = {
          name: 'sample',
          description: 'here a description',
          url: 'http://test.com'
        }
        return expect(Iniitialize.generate(options)).rejects.toThrow('Please share a project url environment.')
      })

      test('Create config file into a specific folder but first scenario generation failed', async () => {
        const mockLogger = {
          info: jest.fn(),
          log: jest.fn(),
          success: jest.fn()
        }

        jest.mock('../utils/logger', () => {
          return mockLogger
        })

        const filename = path.resolve('/tmp/', '.restqa.yml')
        files.push(filename)
        const Initialize = require('./initialize')

        mockGenerator.mockRejectedValue('Error')

        const options = {
          name: 'my sample api',
          url: 'http://test.sample.com',
          env: 'production',
          description: 'This is my description',
          folder: '/tmp/'
        }

        await Initialize.generate(options)

        expect(mockLogger.info.mock.calls).toHaveLength(1)
        expect(mockLogger.log.mock.calls).toHaveLength(1)
        expect(mockLogger.success.mock.calls).toHaveLength(1)

        expect(mockLogger.success.mock.calls[0][0]).toEqual('.restqa.yml file created successfully')
        expect(mockLogger.log.mock.calls[0][0]).toEqual('tests/integration/welcome-restqa.feature couldn\'t be created but no worries you can generate it using: restqa generate curl https://restqa.io/welcome.json -o welcome.feature')
        expect(mockLogger.info.mock.calls[0][0]).toEqual('You are ready to run your first test scenario using the command: restqa run')

        const content = fs.readFileSync(filename).toString('utf-8')
        const YAML = require('yaml')
        const result = YAML.parse(content)

        const expectedContent = {
          version: '0.0.1',
          metadata: {
            code: 'MY-SAMPLE-API',
            name: 'my sample api',
            description: 'This is my description'
          },
          environments: [{
            name: 'production',
            default: true,
            plugins: [{
              name: 'restqapi',
              config: {
                url: 'http://test.sample.com'
              }
            }],
            outputs: [{
              type: 'html',
              enabled: true
            }, {
              type: 'file',
              enabled: true,
              config: {
                path: 'restqa-result.json'
              }
            }]
          }]
        }

        expect(result).toEqual(expectedContent)

        const filenameWelcome = path.resolve('/tmp', 'tests', 'integration', 'welcome-restqa.feature')
        expect(fs.existsSync(filenameWelcome)).toBe(false)
      })

      test('Create config file into a specific folder', async () => {
        const mockLogger = {
          info: jest.fn(),
          log: jest.fn(),
          success: jest.fn()
        }

        jest.mock('../utils/logger', () => {
          return mockLogger
        })

        const filename = path.resolve('/tmp/', '.restqa.yml')
        files.push(filename)
        const Initialize = require('./initialize')

        mockGenerator.mockResolvedValue('Given I have an example')

        const options = {
          name: 'my sample api',
          url: 'http://test.sample.com',
          env: 'production',
          description: 'This is my description',
          folder: '/tmp/'
        }

        await Initialize.generate(options)

        expect(mockLogger.info.mock.calls).toHaveLength(1)
        expect(mockLogger.success.mock.calls).toHaveLength(2)

        expect(mockLogger.success.mock.calls[0][0]).toEqual('.restqa.yml file created successfully')
        expect(mockLogger.success.mock.calls[1][0]).toEqual('tests/integration/welcome-restqa.feature file created successfully')
        expect(mockLogger.info.mock.calls[0][0]).toEqual('You are ready to run your first test scenario using the command: restqa run')

        const content = fs.readFileSync(filename).toString('utf-8')
        const YAML = require('yaml')
        const result = YAML.parse(content)

        const expectedContent = {
          version: '0.0.1',
          metadata: {
            code: 'MY-SAMPLE-API',
            name: 'my sample api',
            description: 'This is my description'
          },
          environments: [{
            name: 'production',
            default: true,
            plugins: [{
              name: 'restqapi',
              config: {
                url: 'http://test.sample.com'
              }
            }],
            outputs: [{
              type: 'html',
              enabled: true
            }, {
              type: 'file',
              enabled: true,
              config: {
                path: 'restqa-result.json'
              }
            }]
          }]
        }
        expect(result).toEqual(expectedContent)

        const filenameWelcome = path.resolve('/tmp', 'tests', 'integration', 'welcome-restqa.feature')
        files.push(filenameWelcome)
        const contentWelcome = fs.readFileSync(filenameWelcome).toString('utf-8')
        const expectedWelcomeFeature = `
Feature: Welcome to the RestQA community

Scenario: Get the list of useful RestQA resources
Given I have an example`

        expect(contentWelcome.trim()).toEqual(expectedWelcomeFeature.trim())
      })
    })
  })

  describe('Initialize', () => {
    test('Generate a restqa config and a ci file', async () => {
      const ciFilename = path.resolve(process.cwd(), '.gitlab-ci.yml')
      files.push(ciFilename)

      const mockPrompt = jest.fn().mockResolvedValue({
        name: 'my new sample api',
        url: 'http://test.new.sample.com',
        env: 'local',
        description: 'This is my new description',
        ci: 'gitlab-ci'
      })

      jest.mock('inquirer', () => {
        return {
          Separator: jest.fn(),
          prompt: mockPrompt
        }
      })

      const Initialize = require('./initialize')

      await Initialize({})

      const contentCi = fs.readFileSync(ciFilename).toString('utf-8')
      const YAML = require('yaml')
      const resultCi = YAML.parse(contentCi)

      const expectedContentCi = {
        stages: [
          'e2e test'
        ],
        RestQa: {
          stage: 'e2e test',
          image: {
            name: 'restqa/restqa'
          },
          script: [
            'restqa run .'
          ]
        }
      }
      expect(resultCi).toEqual(expectedContentCi)

      const filename = path.resolve(process.cwd(), '.restqa.yml')
      files.push(filename)
      const content = fs.readFileSync(filename).toString('utf-8')
      const result = YAML.parse(content)

      const expectedContent = {
        version: '0.0.1',
        metadata: {
          code: 'MY-NEW-SAMPLE-API',
          name: 'my new sample api',
          description: 'This is my new description'
        },
        environments: [{
          name: 'local',
          default: true,
          plugins: [{
            name: 'restqapi',
            config: {
              url: 'http://test.new.sample.com'
            }
          }],
          outputs: [{
            type: 'html',
            enabled: true
          }, {
            type: 'file',
            enabled: true,
            config: {
              path: 'restqa-result.json'
            }
          }]
        }]
      }
      expect(result).toEqual(expectedContent)
      expect(mockPrompt.mock.calls).toHaveLength(1)
      const expectedQuestions = [
        'Project name:',
        'Description:',
        'Url of the project api:',
        'Environment name of this url (local) ?',
        'Do you need a continuous integration configuration ?'
      ]
      expect(mockPrompt.mock.calls[0][0].map(_ => _.message)).toEqual(expectedQuestions)
    })

    test('Generate a restqa config Generate it without having it ask any questions', async () => {
      const mockPrompt = jest.fn()

      jest.mock('inquirer', () => {
        return {
          Separator: jest.fn(),
          prompt: mockPrompt
        }
      })

      const Iniitialize = require('./initialize')

      await Iniitialize({ y: true })

      const YAML = require('yaml')

      let filename = path.resolve(process.cwd(), '.restqa.yml')
      files.push(filename)
      const content = fs.readFileSync(filename).toString('utf-8')
      const result = YAML.parse(content)

      const expectedContent = {
        version: '0.0.1',
        metadata: {
          code: 'APP',
          name: 'app',
          description: 'Configuration generated by restqa init'
        },
        environments: [{
          name: 'local',
          default: true,
          plugins: [{
            name: 'restqapi',
            config: {
              url: 'https://api.restqa.io'
            }
          }],
          outputs: [{
            type: 'html',
            enabled: true
          }, {
            type: 'file',
            enabled: true,
            config: {
              path: 'restqa-result.json'
            }
          }]
        }]
      }
      expect(result).toEqual(expectedContent)
      expect(mockPrompt.mock.calls).toHaveLength(0)

      filename = path.resolve(process.cwd(), 'bitbucket-pipelines.yml')
      expect(fs.existsSync(filename)).toBe(false)
      filename = path.resolve(process.cwd(), '.gitlab-ci.yml')
      expect(fs.existsSync(filename)).toBe(false)
      filename = path.resolve(process.cwd(), '.github', 'workflows', 'integration-test.yml')
      expect(fs.existsSync(filename)).toBe(false)
      filename = path.resolve(process.cwd(), 'circleci', 'config.yml')
      expect(fs.existsSync(filename)).toBe(false)
    })
  })
})
