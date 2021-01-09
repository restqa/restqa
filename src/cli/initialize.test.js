const fs = require('fs')
const path = require('path')
let filename

afterEach(() => {
  jest.resetModules()
  if (filename && fs.existsSync(filename)) {
    fs.unlinkSync(filename)
  }
})

beforeEach(() => {
  if (filename && fs.existsSync(filename)) {
    fs.unlinkSync(filename)
    filename = undefined
  }
})

describe('#Cli - Initialize', () => {

  describe('CI', () => {

    test('Throw an error if the CI is not a part of the list', async () => {
      const Iniitialize = require('./initialize')
      jest.mock('inquirer', () => {
        return {
          Separator: jest.fn(),
          prompt: jest.fn().mockResolvedValue({
            ci: 'GoCd'
          })
        }
      })

      expect(Iniitialize({})).rejects.toThrow('The continous integration "GoCd" is not supported by RestQa')
    })

    test('Create Github action file if selected', async () => {
      filename = path.resolve(process.cwd(), '.github', 'workflows', 'integration-test.yml')
      const Iniitialize = require('./initialize')
      jest.mock('inquirer', () => {
        return {
          Separator: jest.fn(),
          prompt: jest.fn().mockResolvedValue({
            ci: 'github-action'
          })
        }
      })
      const options = {}
      await Iniitialize(options)

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

    test('Create Gitlab-ci file  if selected', async () => {
      filename = path.resolve(process.cwd(), '.gitlab-ci.yml')
      const Iniitialize = require('./initialize')
      jest.mock('inquirer', () => {
        return {
          Separator: jest.fn(),
          prompt: jest.fn().mockResolvedValue({
            ci: 'gitlab-ci'
          })
        }
      })
      const options = {}
      await Iniitialize(options)

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

    test('Create Bitbucket pipeline file  if selected', async () => {
      filename = path.resolve(process.cwd(), 'bitbucket-pipelines.yml')
      const Iniitialize = require('./initialize')
      jest.mock('inquirer', () => {
        return {
          Separator: jest.fn(),
          prompt: jest.fn().mockResolvedValue({
            ci: 'bitbucket-pipeline'
          })
        }
      })
      const options = {}
      await Iniitialize(options)

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

    test('Do nothing if any CI hasn\'t been selected', async () => {
      filename = path.resolve(process.cwd(), 'bitbucket-pipelines.yml')
      const Iniitialize = require('./initialize')
      jest.mock('inquirer', () => {
        return {
          Separator: jest.fn(),
          prompt: jest.fn().mockResolvedValue({
            ci: false
          })
        }
      })
      const options = {}
      await Iniitialize(options)

      filename = path.resolve(process.cwd(), 'bitbucket-pipelines.yml')
      expect(fs.existsSync(filename)).toBe(false)
      filename = path.resolve(process.cwd(), '.gitlab-ci.yml')
      expect(fs.existsSync(filename)).toBe(false)
      filename = path.resolve(process.cwd(), '.github', 'workflows', 'integration-test.yml')
      expect(fs.existsSync(filename)).toBe(false)
    })

    test('Do nothing if any CI hasn\'t  been answered', async () => {
      filename = path.resolve(process.cwd(), 'bitbucket-pipelines.yml')
      const Iniitialize = require('./initialize')
      jest.mock('inquirer', () => {
        return {
          prompt: jest.fn().mockResolvedValue({}),
          Separator: jest.fn()
        }
      })
      const options = {}
      await Iniitialize(options)

      filename = path.resolve(process.cwd(), 'bitbucket-pipelines.yml')
      expect(fs.existsSync(filename)).toBe(false)
      filename = path.resolve(process.cwd(), '.gitlab-ci.yml')
      expect(fs.existsSync(filename)).toBe(false)
      filename = path.resolve(process.cwd(), '.github', 'workflows', 'integration-test.yml')
      expect(fs.existsSync(filename)).toBe(false)
    })
  })
})

