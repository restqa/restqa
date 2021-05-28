const mutations = {
  config (state, obj) {
    state.config = obj
  },
  loadingConfig (state, bool) {
    state.loadingConfig = bool
  }
}

export default mutations
