import getters from './getters'

describe('getters', () => {
  describe('loadConfig', () => {
    test('get the current loading config state', () => {
      const state = {
        loadingConfig: true
      }

      const result = getters.loadingConfig(state)
      expect(result).toEqual(true)
    })
  })

  describe('getConfig', () => {
    test('get the current config', () => {
      const state = {
        config: {
          foo: 'bar'
        }
      }

      const result = getters.config(state)
      expect(result).toEqual({ foo: 'bar' })
    })
  })
})
