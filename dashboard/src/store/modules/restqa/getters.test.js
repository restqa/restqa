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

  describe('environements', () => {
    test('get the environments state', () => {
      const state = {
        config: {
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
      }

      const result = getters.environments(state)
      expect(result).toEqual(['local', 'uat'])
    })
  })

  describe('selectedEnv', () => {
    test('get the current selectedEnv state', () => {
      const state = {
        selectedEnv: 'uat'
      }

      const result = getters.selectedEnv(state)
      expect(result).toEqual('uat')
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

  describe('getSteps', () => {
    test('get the step definition', () => {
      const state = {
        steps: [{
          foo: 'bar'
        }]
      }

      const result = getters.steps(state)
      expect(result).toEqual([{ foo: 'bar' }])
    })
  })

  describe('getInfo', () => {
    test('get the current info', () => {
      const state = {
        info: {
          foo: 'bar'
        }
      }

      const result = getters.info(state)
      expect(result).toEqual({ foo: 'bar' })
    })
  })

  describe('getFeatures', () => {
    test('get the current feature list', () => {
      const state = {
        features: [
          '/test.foo'
        ]
      }

      const result = getters.features(state)
      expect(result).toEqual([ '/test.foo' ])
    })
  })

  describe('selectedFile', () => {
    test('get the current selected file', () => {
      const state = {
        selectedFile: '/test.foo'
      }

      const result = getters.selectedFile(state)
      expect(result).toEqual('/test.foo')
    })
  })
})
