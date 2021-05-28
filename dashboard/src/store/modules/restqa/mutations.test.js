import mutations from './mutations'

describe('mutations', () => {
  describe('config', () => {
    
    const { config, loadingConfig } = mutations

    test('update Config states', () => {
      const state = {
        config: null,
        loadingConfig: false
      }

      const expectedConfig = {
        foo: 'bar'
      }
      config(state, expectedConfig)

      expect(state.config).toEqual(expectedConfig)
      expect(state.loadingConfig).toEqual(false)
    })

    test('update loadingConfig states', () => {
      const state = {
        loadingConfig: false
      }

      loadingConfig(state, true)

      expect(state.loadingConfig).toEqual(true)
    })
  })
})

