process.setMaxListeners(Infinity)

const fs = require('fs')
const path = require('path')
const os = require('os')

let mockGenerator

const jestqa = new JestQA(__filename, true)

beforeEach(jestqa.beforeEach)
afterEach(jestqa.afterEach)

jestqa.hooks.beforeEach = function () {
  mockGenerator = jest.fn()
  jest.mock('@restqa/restqapi', () => ({
    Generator: mockGenerator
  }))
}

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
      jestqa.getCurrent().files.push(filename)

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
            }, {
              name: 'RestQA Report',
              uses: 'actions/upload-artifact@v2',
              with: {
                name: 'restqa-report',
                path: 'report'
              }
            }]
          }
        }
      }

      expect(result).toEqual(expectedContent)
      expect(jestqa.getLoggerMock()).toHaveBeenCalledTimes(4)

      expect(jestqa.getLoggerMock().mock.calls[0][0]).toMatch('.restqa.yml file created successfully')
      expect(jestqa.getLoggerMock().mock.calls[1][0]).toMatch('.github/workflows/integration-test.yml file created successfully')
      expect(jestqa.getLoggerMock().mock.calls[2][0]).toMatch('tests/integration/welcome-restqa.feature file created successfully')
      expect(jestqa.getLoggerMock().mock.calls[3][0]).toMatch('You are ready to run your first test scenario using the command: restqa run')
    })

    test('Create Gitlab-ci file if selected', async () => {
      const filename = path.resolve(process.cwd(), '.gitlab-ci.yml')
      jestqa.getCurrent().files.push(filename)

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
          ],
          artifacts: {
            paths: [
              'report'
            ]
          }
        }
      }
      expect(result).toEqual(expectedContent)
      expect(jestqa.getLoggerMock()).toHaveBeenCalledTimes(4)

      expect(jestqa.getLoggerMock().mock.calls[0][0]).toMatch('.restqa.yml file created successfully')
      expect(jestqa.getLoggerMock().mock.calls[1][0]).toMatch('.gitlab-ci.yml file created successfully')
      expect(jestqa.getLoggerMock().mock.calls[2][0]).toMatch('tests/integration/welcome-restqa.feature file created successfully')
      expect(jestqa.getLoggerMock().mock.calls[3][0]).toMatch('You are ready to run your first test scenario using the command: restqa run')
    })

    test('Create Bitbucket pipeline file  if selected', async () => {
      const filename = path.resolve(process.cwd(), 'bitbucket-pipelines.yml')
      jestqa.getCurrent().files.push(filename)
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
              ],
              artifacts: [
                'report/**'
              ]
            }
          }]
        }
      }
      expect(result).toEqual(expectedContent)
      expect(jestqa.getLoggerMock()).toHaveBeenCalledTimes(4)

      expect(jestqa.getLoggerMock().mock.calls[0][0]).toMatch('.restqa.yml file created successfully')
      expect(jestqa.getLoggerMock().mock.calls[1][0]).toMatch('bitbucket-pipelines.yml file created successfully')
      expect(jestqa.getLoggerMock().mock.calls[2][0]).toMatch('tests/integration/welcome-restqa.feature file created successfully')
      expect(jestqa.getLoggerMock().mock.calls[3][0]).toMatch('You are ready to run your first test scenario using the command: restqa run')
    })

    test('Create Circle-ci pipeline file if selected', async () => {
      const filename = path.resolve(process.cwd(), '.circleci/config.yml')
      jestqa.getCurrent().files.push(filename)
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
      expect(jestqa.getLoggerMock()).toHaveBeenCalledTimes(4)

      expect(jestqa.getLoggerMock().mock.calls[0][0]).toMatch('.restqa.yml file created successfully')
      expect(jestqa.getLoggerMock().mock.calls[1][0]).toMatch('circleci/config.yml file created successfully')
      expect(jestqa.getLoggerMock().mock.calls[2][0]).toMatch('tests/integration/welcome-restqa.feature file created successfully')
      expect(jestqa.getLoggerMock().mock.calls[3][0]).toMatch('You are ready to run your first test scenario using the command: restqa run')
    })

    test('Create travis-ci pipeline file if selected', async () => {
      const filename = path.resolve(process.cwd(), '.travis.yml')
      jestqa.getCurrent().files.push(filename)
      const Iniitialize = require('./initialize')
      const options = {
        name: 'sample',
        url: 'http://test.com',
        env: 'test',
        description: 'my description',
        ci: 'travis'
      }
      mockGenerator.mockResolvedValue('Given I have an example')
      await Iniitialize.generate(options)

      const content = fs.readFileSync(filename).toString('utf-8')
      const YAML = require('yaml')
      const result = YAML.parse(content)

      const expectedContent = {
        dist: 'trusty',
        jobs: {
          include: [
            {
              stage: 'test',
              script: 'docker run --rm -v $PWD:/app restqa/restqa'
            }
          ]
        }
      }

      expect(result).toEqual(expectedContent)
      expect(jestqa.getLoggerMock()).toHaveBeenCalledTimes(4)

      expect(jestqa.getLoggerMock().mock.calls[0][0]).toMatch('.restqa.yml file created successfully')
      expect(jestqa.getLoggerMock().mock.calls[1][0]).toMatch('.travis.yml file created successfully')
      expect(jestqa.getLoggerMock().mock.calls[2][0]).toMatch('tests/integration/welcome-restqa.feature file created successfully')
      expect(jestqa.getLoggerMock().mock.calls[3][0]).toMatch('You are ready to run your first test scenario using the command: restqa run')
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
      filename = path.resolve(process.cwd(), 'travis.yml')
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
      filename = path.resolve(process.cwd(), 'travis.yml')
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
        const filename = path.resolve(os.tmpdir(), '.restqa.yml')
        jestqa.getCurrent().files.push(filename)

        const Initialize = require('./initialize')

        mockGenerator.mockRejectedValue('Error')

        const options = {
          name: 'my sample api',
          url: 'http://test.sample.com',
          env: 'production',
          description: 'This is my description',
          folder: os.tmpdir()
        }

        await Initialize.generate(options)

        expect(jestqa.getLoggerMock().mock.calls).toHaveLength(3)

        expect(jestqa.getLoggerMock().mock.calls[0][0]).toMatch('.restqa.yml file created successfully')
        expect(jestqa.getLoggerMock().mock.calls[1][0]).toMatch('tests/integration/welcome-restqa.feature couldn\'t be created but no worries you can generate it using: restqa generate curl https://restqa.io/welcome.json -o welcome.feature')
        expect(jestqa.getLoggerMock().mock.calls[2][0]).toMatch('You are ready to run your first test scenario using the command: restqa run')

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
              name: '@restqa/restqapi',
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

        const filenameWelcome = path.resolve(os.tmpdir(), 'tests', 'integration', 'welcome-restqa.feature')
        expect(fs.existsSync(filenameWelcome)).toBe(false)
      })

      test('Create config file into a specific folder', async () => {
        const filename = path.resolve(os.tmpdir(), '.restqa.yml')
        jestqa.getCurrent().files.push(filename)
        const Initialize = require('./initialize')

        mockGenerator.mockResolvedValue('Given I have an example')

        const options = {
          name: 'my sample api',
          url: 'http://test.sample.com',
          env: 'production',
          description: 'This is my description',
          folder: os.tmpdir()
        }

        await Initialize.generate(options)

        expect(global.console.info.mock.calls).toHaveLength(3)

        expect(jestqa.getLoggerMock().mock.calls[0][0]).toMatch('.restqa.yml file created successfully')
        expect(jestqa.getLoggerMock().mock.calls[1][0]).toMatch('tests/integration/welcome-restqa.feature file created successfully')
        expect(jestqa.getLoggerMock().mock.calls[2][0]).toMatch('You are ready to run your first test scenario using the command: restqa run')

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
              name: '@restqa/restqapi',
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

        const filenameWelcome = path.resolve(os.tmpdir(), 'tests', 'integration', 'welcome-restqa.feature')
        jestqa.getCurrent().files.push(filenameWelcome)
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
      jestqa.getCurrent().files.push(ciFilename)

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
          ],
          artifacts: {
            paths: [
              'report'
            ]
          }
        }
      }
      expect(resultCi).toEqual(expectedContentCi)

      const filename = path.resolve(process.cwd(), '.restqa.yml')
      jestqa.getCurrent().files.push(filename)

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
            name: '@restqa/restqapi',
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
      jestqa.getCurrent().files.push(filename)
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
            name: '@restqa/restqapi',
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
