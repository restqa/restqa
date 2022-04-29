const OUTPUT = global.window.OUTPUT || {};

const state = {
  config: null,
  loadingConfig: false,
  selectedEnv: null,
  info: null,
  steps: null,
  features: [],
  selectedFile: null,
  preferences: {},
  testReport: OUTPUT.RESTQA_RESULT,
  projectStatus: {
    unit: {
      label: "Unit Test",
      enabled: true,
      hidden: false,
      data: OUTPUT.RESTQA_RESULT
    },
    integration: {
      label: "Integration Tests",
      enabled: Boolean(OUTPUT.RESTQA_INTEGRATION),
      hidden: false,
      data: OUTPUT.RESTQA_INTEGRATION
    },
    performance: {
      label: "Performance Tests",
      enabled: Boolean(OUTPUT.RESTQA_PERFORMANCE),
      hidden: false,
      data: OUTPUT.RESTQA_PERFORMANCE
    },
    specification: {
      label: "API specification",
      enabled: Boolean(OUTPUT.RESTQA_SPECIFICATION),
      hidden: false,
      data: OUTPUT.RESTQA_SPECIFICATION
    },
    postman: {
      label: "Postman collection",
      enabled: Boolean(OUTPUT.RESTQA_POSTMAN),
      hidden: false,
      data: OUTPUT.RESTQA_POSTMAN
    },
    contributors: {
      label: "Contributors",
      hidden: true,
      data: OUTPUT.RESTQA_CONTRIBUTORS
    }
  }
};
export default state;
