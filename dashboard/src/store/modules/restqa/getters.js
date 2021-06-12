const getters = {
  info (state) {
    return state.info
  },
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
  },
  steps (state) {
    return state.steps
  }
}

export default getters
