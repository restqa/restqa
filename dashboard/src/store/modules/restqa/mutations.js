const mutations = {
  config (state, obj) {
    state.config = obj
  },
  loadingConfig (state, bool) {
    state.loadingConfig = bool
  },
  selectedEnv (state, val) {
    state.selectedEnv = val
  }
}

export default mutations
