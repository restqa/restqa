import state from './state'

describe('state', () => {
  it('Avaiable states', () => {
    const expectedState = {
      config: null,
      loadingConfig: false,
      selectedEnv: null,
      info: null,
      steps: null,
      features: [],
      selectedFile: null,
      preferences: {}
    }
    expect(state).toEqual(expectedState)
  })
})
