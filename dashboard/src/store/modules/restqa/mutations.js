const mutations = {
  info (state, obj) {
    state.info = obj
  },
  config (state, obj) {
    state.config = obj
  },
  loadingConfig (state, bool) {
    state.loadingConfig = bool
  },
  selectedEnv (state, val) {
    state.selectedEnv = val
  },
  steps (state, val) {
    state.steps = val
  }
}

export default mutations
