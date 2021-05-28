import state from './state'

describe('state', () => {
  it('Avaiable states', () => {
    const expectedState = {
      config: null,
      loadingConfig: false
    }
    expect(state).toEqual(expectedState)
  })
})
