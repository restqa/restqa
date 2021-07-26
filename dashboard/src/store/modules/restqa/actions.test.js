import { ForbiddenError} from '../../../services/http'

let mockGet
let mockPost

jest.mock('axios', () => {
  const originalModule = jest.requireActual('axios')
  return {
    ...originalModule,
    create: function() {
      return this
    },
    get: function () {
      return mockGet.apply(this, arguments)
    },
    post: function () {
      return mockPost.apply(this, arguments)
    }
  }
})

beforeEach(() => {
  mockGet = undefined
  mockPost = undefined
})

import actions from './actions'

describe('actions', () => {
  describe('config', () => {

    test('Get the successful config and select the default env', async () => {
      const data = {
        version: '0.0.1',
        metadata: {
          code: 'FEATURE',
          name: 'feature',
          description: 'fff'
        },
        environments: [{
          name: 'local',
          plugins: [{
            name: '@restqa/restqapi',
            config: {
              url: 'http://localhost:3000'
            }
          }],
          outputs: [{
            type: 'html',
            enabled: true
          },{
            type: 'file',
            enabled: true,
            config: {
              path: 'restqa-result.json'
            }
          }]
        }]
      }

      mockGet = jest.fn().mockResolvedValue({ data })

      const context = {
        commit: jest.fn()
      }

      await actions.config(context)

      expect(context.commit).toHaveBeenCalledTimes(4)

      expect(context.commit.mock.calls[0][0]).toEqual('loadingConfig')
      expect(context.commit.mock.calls[0][1]).toEqual(true)
      expect(context.commit.mock.calls[1][0]).toEqual('config')
      expect(context.commit.mock.calls[1][1]).toEqual(data)
      expect(context.commit.mock.calls[2][0]).toEqual('selectedEnv')
      expect(context.commit.mock.calls[2][1]).toEqual('local')
      expect(context.commit.mock.calls[3][0]).toEqual('loadingConfig')
      expect(context.commit.mock.calls[3][1]).toEqual(false)
    })

    test('Get the successful config and select the default env (2 env availables)', async () => {
      const data = {
        version: '0.0.1',
        metadata: {
          code: 'FEATURE',
          name: 'feature',
          description: 'fff'
        },
        environments: [{
          name: 'local',
          plugins: [{
            name: '@restqa/restqapi',
            config: {
              url: 'http://localhost:3000'
            }
          }],
          outputs: [{
            type: 'html',
            enabled: true
          },{
            type: 'file',
            enabled: true,
            config: {
              path: 'restqa-result.json'
            }
          }]
        }, {
          name: 'uat',
          default: true,
          plugins: [{
            name: '@restqa/faker-plugin',
            config: {
              url: 'https://docs.restqa.io'
            }
          }, {
            name: '@restqa/restqapi',
            config: {
              url: 'https://uat.restqa.io'
            }
          }],
          outputs: [{
            type: 'html',
            enabled: true
          }]
        }]
      }

      mockGet = jest.fn().mockResolvedValue({ data })

      const context = {
        commit: jest.fn()
      }

      await actions.config(context)
      expect(context.commit).toHaveBeenCalledTimes(4)

      expect(context.commit.mock.calls[0][0]).toEqual('loadingConfig')
      expect(context.commit.mock.calls[0][1]).toEqual(true)
      expect(context.commit.mock.calls[1][0]).toEqual('config')
      expect(context.commit.mock.calls[1][1]).toEqual(data)
      expect(context.commit.mock.calls[2][0]).toEqual('selectedEnv')
      expect(context.commit.mock.calls[2][1]).toEqual('uat')
      expect(context.commit.mock.calls[3][0]).toEqual('loadingConfig')
      expect(context.commit.mock.calls[3][1]).toEqual(false)
    })

    test('Get the unsuccessful config', async () => {
      mockGet = jest.fn().mockRejectedValue(new ForbiddenError('No access'))

      const context = {
        commit: jest.fn()
      }

      await actions.config(context)

      expect(context.commit).toHaveBeenCalledTimes(3)

      expect(context.commit.mock.calls[0][0]).toEqual('loadingConfig')
      expect(context.commit.mock.calls[0][1]).toEqual(true)
      expect(context.commit.mock.calls[1][0]).toEqual('config')
      expect(context.commit.mock.calls[1][1]).toEqual(false)
      expect(context.commit.mock.calls[2][0]).toEqual('loadingConfig')
      expect(context.commit.mock.calls[2][1]).toEqual(false)
    })
  })

  describe('info', () => {

    test('Should commit the default information when the remote call fails', async () => {
      mockGet = jest.fn().mockRejectedValue(new Error('oups'))

      const data = require('../../../assets/data/info.json')

      const context = {
        commit: jest.fn()
      }

      await actions.info(context)
      expect(context.commit).toHaveBeenCalledTimes(1)
      expect(context.commit.mock.calls[0][0]).toEqual('info')
      expect(context.commit.mock.calls[0][1]).toEqual(data)
    })

    test('Should commit the information retrieved from the remote server', async () => {
      const data = {
        foo: 'bar'
      }

      mockGet = jest.fn().mockResolvedValueOnce({ data })

      const context = {
        commit: jest.fn()
      }

      await actions.info(context)
      expect(context.commit).toHaveBeenCalledTimes(1)
      expect(context.commit.mock.calls[0][0]).toEqual('info')
      expect(context.commit.mock.calls[0][1]).toEqual(data)
    })
  })

  describe('selectedEnv', () => {
    test('setup the selectedEnv', async () => {

      const context = {
        commit: jest.fn()
      }

      await actions.selectedEnv(context, true)

      expect(context.commit).toHaveBeenCalledTimes(1)

      expect(context.commit.mock.calls[0][0]).toEqual('selectedEnv')
      expect(context.commit.mock.calls[0][1]).toEqual(true)
    })
  })

  describe('selectedFile', () => {
    test('setup the selectedFile', async () => {

      const context = {
        commit: jest.fn()
      }

      const evt = {
        label: 'test.feature',
        filename: 'root/folder/test.feature',
        children: []
      }
      await actions.selectedFile(context, evt)

      expect(context.commit).toHaveBeenCalledTimes(1)

      expect(context.commit.mock.calls[0][0]).toEqual('selectedFile')
      expect(context.commit.mock.calls[0][1]).toEqual(evt.filename)
    })

    test('Do not commit if the selected file doesnt contains a filename', async () => {

      const context = {
        commit: jest.fn()
      }

      const evt = {
        label: 'test.feature',
        children: []
      }
      await actions.selectedFile(context, evt)

      expect(context.commit).toHaveBeenCalledTimes(0)
    })
  })

  describe('steps', () => {
    test('Get the Full list of steps', async () => {
      const data = [{
          plugin: '@restqa/restqapi',
          keyword: 'Given',
          step: 'I have the api gateway',
          comment: 'Initiate the api call'
        }, {
          plugin: '@restqa/restqapi',
          keyword: 'When',
          step: 'I call the api',
          comment: 'perform the api call'
      }]

      mockGet = jest.fn().mockResolvedValue({ data })

      const context = {
        commit: jest.fn()
      }

      await actions.steps(context)

      expect(context.commit).toHaveBeenCalledTimes(1)

      expect(context.commit.mock.calls[0][0]).toEqual('steps')
      expect(context.commit.mock.calls[0][1]).toEqual(data)
    })

    test('No updates if there is an issue on retrieving the steps', async () => {
      mockGet = jest.fn().mockRejectedValue(new Error('backend server'))

      const context = {
        commit: jest.fn()
      }

      await actions.steps(context)

      expect(context.commit).toHaveBeenCalledTimes(0)
    })
  })

  describe('features', () => {
    test('Get the Full list of features', async () => {
      const data = [
        'root/foo/bar'
      ]

      mockGet = jest.fn().mockResolvedValue({ data })

      const context = {
        commit: jest.fn()
      }

      await actions.features(context)

      expect(context.commit).toHaveBeenCalledTimes(1)

      expect(context.commit.mock.calls[0][0]).toEqual('features')
      const expectedresult = [{
        label: 'root',
        children: [{
          label: 'foo',
          children: [{
            label: 'bar',
            filename: 'root/foo/bar',
            children: []
          }]
        }]
      }]
      expect(context.commit.mock.calls[0][1]).toEqual(expectedresult)
    })

    test('No updates if there is an issue on retrieving the features', async () => {
      mockGet = jest.fn().mockRejectedValue(new Error('backend server'))

      const context = {
        commit: jest.fn()
      }

      await actions.features(context)

      expect(context.commit).toHaveBeenCalledTimes(0)
    })
  })

  describe('testResult', () => {
    test('Run a feature file', async () => {
      const data = {
        path: 'foo-bar.feature',
        data: {
          foo: {
            bar: 'result'
          }
        }
      }

      mockPost = jest.fn().mockResolvedValue(data)

      const context = {
        commit: jest.fn()
      }

      await actions.testFeature(context, 'foo-bar.feature')

      expect(context.commit).toHaveBeenCalledTimes(1)

      expect(context.commit.mock.calls[0][0]).toEqual('testResult')
      expect(context.commit.mock.calls[0][1]).toEqual(data)
    })

    test('Update an error if there is an issue on run of the features', async () => {
      const err = new Error('backend server')
      mockPost = jest.fn().mockRejectedValue(err)

      const context = {
        commit: jest.fn()
      }

      await actions.testFeature(context, 'foo-bar.feature')

      expect(context.commit.mock.calls[0][0]).toEqual('testResult')
      expect(context.commit.mock.calls[0][1]).toEqual({
        path: 'foo-bar.feature',
        error: err
      })
    })
  })

  describe('preferences', () => {

    test('Get the successful user preferences', async () => {
      const data = {
        telemetry: true
      }

      mockGet = jest.fn().mockResolvedValue({ data })

      const context = {
        commit: jest.fn()
      }

      await actions.preferences(context)

      expect(context.commit).toHaveBeenCalledWith('preferences', data)
    })

    test('Get the unsuccessful user preferences', async () => {
      mockGet = jest.fn().mockRejectedValue(new Error('oups'))

      const context = {
        commit: jest.fn()
      }

      await actions.preferences(context)
      expect(context.commit).toHaveBeenCalledWith('preferences', {})
    })
  })
})
