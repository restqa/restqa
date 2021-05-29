const getters = {
  config (state) {
    return state.config
  },
  loadingConfig (state) {
    return state.loadingConfig
  },
  selectedEnv (state) {
    return state.selectedEnv
  },
  environments (state) {
    return (state.config && state.config.environments && state.config.environments.map(_ => _.name)) || []
  }
}

export default getters
