const getters = {
  info(state) {
    return state.info;
  },
  config(state) {
    return state.config;
  },
  loadingConfig(state) {
    return state.loadingConfig;
  },
  selectedEnv(state) {
    return state.selectedEnv;
  },
  environments(state) {
    return (
      (state.config &&
        state.config.environments &&
        state.config.environments.map((_) => _.name)) ||
      []
    );
  },
  steps(state) {
    return state.steps;
  },
  features(state) {
    return state.features;
  },
  selectedFile(state) {
    return state.selectedFile;
  },
  testResult(state) {
    return state.testResult;
  },
  preferences(state) {
    return state.preferences;
  },
  readOnly(state) {
    if (
      state.config &&
      state.config.restqa &&
      state.config.restqa.dashboard &&
      state.config.restqa.dashboard.readOnly !== undefined
    ) {
      return state.config.restqa.dashboard.readOnly;
    }
    return false;
  }
};

export default getters;
