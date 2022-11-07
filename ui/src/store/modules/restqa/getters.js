const getters = {
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
  },
  testReport(state) {
    return state.testReport;
  },
  projectStatus(state) {
    return state.projectStatus;
  },
  projectConfiguration(state) {
    return state.projectConfiguration;
  },
};

export default getters;
