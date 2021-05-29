let mockConfig
import { ForbiddenError} from '../../../services/http'

jest.mock('../../../services/restqa/project', () => {
  return {
    getConfig: function () {
      return mockConfig.apply(this, arguments)
    }
  }
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

      mockConfig = jest.fn().mockResolvedValue(data)

      const context = {
        commit: jest.fn()
      }

      const result = await actions.config(context)

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

      mockConfig = jest.fn().mockResolvedValue(data)

      const context = {
        commit: jest.fn()
      }

      const result = await actions.config(context)
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
      mockConfig = jest.fn().mockRejectedValue(new ForbiddenError('No access'))

      const context = {
        commit: jest.fn()
      }

      const result = await actions.config(context)

      expect(context.commit).toHaveBeenCalledTimes(3)

      expect(context.commit.mock.calls[0][0]).toEqual('loadingConfig')
      expect(context.commit.mock.calls[0][1]).toEqual(true)
      expect(context.commit.mock.calls[1][0]).toEqual('config')
      expect(context.commit.mock.calls[1][1]).toEqual(false)
      expect(context.commit.mock.calls[2][0]).toEqual('loadingConfig')
      expect(context.commit.mock.calls[2][1]).toEqual(false)
    })
  })

  describe('selectedEnv', () => {
    test('setup the selectedEnv', async () => {

      const context = {
        commit: jest.fn()
      }

      const result = await actions.selectedEnv(context, true)

      expect(context.commit).toHaveBeenCalledTimes(1)

      expect(context.commit.mock.calls[0][0]).toEqual('selectedEnv')
      expect(context.commit.mock.calls[0][1]).toEqual(true)
    })
  })
})
