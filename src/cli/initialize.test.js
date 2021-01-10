const fs = require('fs')
const path = require('path')
let files = []

beforeEach(() => {
  files.forEach(filename => {
    if (filename && fs.existsSync(filename)) {
      fs.unlinkSync(filename)
    }
  })
  files = []
})

afterEach(() => {
  jest.resetModules()

  files.forEach(filename => {
    if (filename && fs.existsSync(filename)) {
      fs.unlinkSync(filename)
    }
  })
})


describe('#Cli - Initialize', () => {

  describe('Genereate', () => {
    describe('CI', () => {

      test('Throw an error if the CI is not a part of the list', () => {
        const Iniitialize = require('./initialize')
        const options =  {
          name: 'sample',
          url: 'http://test.com',
          env: 'test',
          description: 'my description',
          ci: 'GoCd'
        }
        expect(() => Iniitialize.generate(options)).toThrow('The continous integration "GoCd" is not supported by RestQa')
      })

      test('Create Github action file if selected', () => {
        filename = path.resolve(process.cwd(), '.github', 'workflows', 'integration-test.yml')
        files.push(filename)
        const Iniitialize = require('./initialize')
        const options = {
          name: 'sample',
          url: 'http://test.com',
          env: 'test',
          description: 'my description',
          ci: 'github-action'
        }
        Iniitialize.generate(options)

        const content = fs.readFileSync(filename).toString('utf-8')
        const YAML = require('yaml')
        const result = YAML.parse(content)
        const expectedContent = {
          name: 'RestQA - Integration tests',
          on: '[push]',
          jobs: {
            RestQa : {
              'runs-on': 'ubuntu-latest',
              steps: [{
                uses: 'actions/checkout@v1',
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
      })

      test('Create Gitlab-ci file  if selected', () => {
        filename = path.resolve(process.cwd(), '.gitlab-ci.yml')
        files.push(filename)
        const Iniitialize = require('./initialize')
        const options = {
          name: 'sample',
          url: 'http://test.com',
          env: 'test',
          description: 'my description',
          ci: 'gitlab-ci'
        }
        Iniitialize.generate(options)

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
      })

      test('Create Bitbucket pipeline file  if selected', () => {
        filename = path.resolve(process.cwd(), 'bitbucket-pipelines.yml')
        files.push(filename)
        const Iniitialize = require('./initialize')
        const options = {
          name: 'sample',
          url: 'http://test.com',
          env: 'test',
          description: 'my description',
          ci: 'bitbucket-pipeline'
        }
        Iniitialize.generate(options)

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
      })

      test('Do nothing if any CI hasn\'t been selected', () => {
        const Iniitialize = require('./initialize')
        const options = {
          name: 'sample',
          url: 'http://test.com',
          env: 'test',
          description: 'my description',
          ci: false
        }
        Iniitialize.generate(options)

        filename = path.resolve(process.cwd(), 'bitbucket-pipelines.yml')
        expect(fs.existsSync(filename)).toBe(false)
        filename = path.resolve(process.cwd(), '.gitlab-ci.yml')
        expect(fs.existsSync(filename)).toBe(false)
        filename = path.resolve(process.cwd(), '.github', 'workflows', 'integration-test.yml')
        expect(fs.existsSync(filename)).toBe(false)
      })

      test('Do nothing if any CI hasn\'t  been answered', () => {
        const Iniitialize = require('./initialize')
        const options = {
          name: 'sample',
          url: 'http://test.com',
          env: 'test',
          description: 'my description'
        }
        Iniitialize.generate(options)

        filename = path.resolve(process.cwd(), 'bitbucket-pipelines.yml')
        expect(fs.existsSync(filename)).toBe(false)
        filename = path.resolve(process.cwd(), '.gitlab-ci.yml')
        expect(fs.existsSync(filename)).toBe(false)
        filename = path.resolve(process.cwd(), '.github', 'workflows', 'integration-test.yml')
        expect(fs.existsSync(filename)).toBe(false)
      })
    })

    describe('restqa configuration file', () => {

      test('Throw an error if the name is not defined', () => {
        const Iniitialize = require('./initialize')
        const options = {}
        expect(() => Iniitialize.generate(options)).toThrow('Please share a project name.')
      })

      test('Throw an error if the description is not defined', () => {
        const Iniitialize = require('./initialize')
        const options = {
          name: 'sample'
        }
        expect(() => Iniitialize.generate(options)).toThrow('Please share a project description.')
      })

      test('Throw an error if the url is not defined', () => {
        const Iniitialize = require('./initialize')
        const options = {
          name: 'sample',
          description: 'here a description'
        }
        expect(() => Iniitialize.generate(options)).toThrow('Please share a project url.')
      })

      test('Throw an error if the environement is not defined', () => {
        const Iniitialize = require('./initialize')
        const options = {
          name: 'sample',
          description: 'here a description',
          url: 'http://test.com' 
        }
        expect(() => Iniitialize.generate(options)).toThrow('Please share a project url environment.')
      })

      test('Create config file', () => {
        filename = path.resolve(process.cwd(), '.restqa.yml')
        files.push(filename)
        const Iniitialize = require('./initialize')
        const options = {
          name: 'my sample api',
          url: 'http://test.sample.com',
          env: 'production',
          description: 'This is my description'
        }
        Iniitialize.generate(options)

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
            output: [{
              type: 'http-html-report',
              enabled: true,
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

        const Iniitialize = require('./initialize')

        await Iniitialize({})

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
            output: [{
              type: 'http-html-report',
              enabled: true,
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
        expect(mockPrompt.mock.calls.length).toBe(1)
        const expectedQuestions = [
          'Project name:',
          'Description:',
          'Host name of the target api (example: http://api.example.com)',
          'Environment name of this url (local) ?',
          'Do you need a continuous integration configuration ?',
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

        await Iniitialize({y: true})

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
            description: 'Configuration generated by restqa init -y'
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
            output: [{
              type: 'http-html-report',
              enabled: true,
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
        expect(mockPrompt.mock.calls.length).toBe(0)

        filename = path.resolve(process.cwd(), 'bitbucket-pipelines.yml')
        expect(fs.existsSync(filename)).toBe(false)
        filename = path.resolve(process.cwd(), '.gitlab-ci.yml')
        expect(fs.existsSync(filename)).toBe(false)
        filename = path.resolve(process.cwd(), '.github', 'workflows', 'integration-test.yml')
        expect(fs.existsSync(filename)).toBe(false)
    })
  })
})
