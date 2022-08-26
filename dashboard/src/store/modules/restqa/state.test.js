import state from "./state";

describe("state", () => {
  it("Avaiable states", () => {
    const expectedState = {
      config: null,
      loadingConfig: false,
      selectedEnv: null,
      info: null,
      steps: null,
      features: [],
      selectedFile: null,
      preferences: {},
      testReport: undefined,
      projectConfiguration: undefined,
      projectStatus: {
        unit: {
          label: "Unit Test",
          enabled: true,
          hidden: false,
          data: undefined
        },
        integration: {
          label: "Integration Tests",
          enabled: false,
          hidden: false,
          data: undefined
        },
        performance: {
          label: "Performance Tests",
          enabled: false,
          hidden: false,
          data: undefined
        },
        specification: {
          label: "API specification",
          enabled: false,
          hidden: false,
          data: undefined
        },
        collection: {
          label: "API collection",
          enabled: false,
          hidden: false,
          data: undefined
        },
        contributors: {
          label: "Contributors",
          hidden: true,
          data: undefined
        },
        httpMocks: {
          label: "HTTP Mocks",
          enabled: undefined,
          hidden: true,
          data: undefined
        }
      }
    };
    expect(state).toEqual(expectedState);
  });
});
