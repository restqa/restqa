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
    test('Get the successful config', async () => {
      mockConfig = jest.fn().mockResolvedValue({
        version: '0.0.1',
        foo: 'bar'
      })

      const context = {
        commit: jest.fn()
      }

      const result = await actions.config(context)

      expect(context.commit).toHaveBeenCalledTimes(3)

      expect(context.commit.mock.calls[0][0]).toEqual('loadingConfig')
      expect(context.commit.mock.calls[0][1]).toEqual(true)
      expect(context.commit.mock.calls[1][0]).toEqual('config')
      expect(context.commit.mock.calls[1][1]).toEqual({
        version: '0.0.1',
        foo: 'bar'
      })
      expect(context.commit.mock.calls[2][0]).toEqual('loadingConfig')
      expect(context.commit.mock.calls[2][1]).toEqual(false)
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
})
