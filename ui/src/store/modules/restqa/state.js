const OUTPUT = window.OUTPUT || {};

const state = {
  testReport: OUTPUT.RESTQA_RESULT,
  projectStatus: {
    unit: {
      label: "Unit Test",
      enabled: true,
      hidden: false,
      data: OUTPUT.RESTQA_RESULT,
    },
    coverage: {
      label: "Code coverage",
      enabled: true,
      hidden: false,
      data: OUTPUT.RESTQA_COVERAGE,
    },
    integration: {
      label: "Integration Tests",
      enabled: Boolean(OUTPUT.RESTQA_INTEGRATION),
      hidden: false,
      data: OUTPUT.RESTQA_INTEGRATION,
    },
    performance: {
      label: "Performance Tests",
      enabled: Boolean(OUTPUT.RESTQA_PERFORMANCE),
      hidden: false,
      data: OUTPUT.RESTQA_PERFORMANCE,
    },
    specification: {
      label: "API specification",
      enabled: Boolean(OUTPUT.RESTQA_SPECIFICATION),
      hidden: false,
      data: OUTPUT.RESTQA_SPECIFICATION,
    },
    collection: {
      label: "API collection",
      enabled: Boolean(OUTPUT.RESTQA_COLLECTION),
      hidden: false,
      data: OUTPUT.RESTQA_COLLECTION,
    },
    contributors: {
      label: "Contributors",
      hidden: true,
      data: OUTPUT.RESTQA_CONTRIBUTORS,
    },
    httpMocks: {
      label: "HTTP Mocks",
      enabled: OUTPUT.RESTQA_HTTP_MOCKS && true,
      hidden: true,
      data: OUTPUT.RESTQA_HTTP_MOCKS,
    },
  },
  projectConfiguration: OUTPUT.RESTQA_CONFIG,
};
export default state;
