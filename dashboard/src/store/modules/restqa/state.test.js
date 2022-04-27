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
      projectStatus: {
        unit: {
          label: "Unit Test",
          enabled: true,
          data: undefined
        },
        integration: {
          label: "Integration Tests",
          enabled: false,
          data: undefined
        },
        performance: {
          label: "Performance Tests",
          enabled: false,
          data: undefined
        },
        specification: {
          label: "API specification",
          enabled: false,
          data: undefined
        },
        postman: {
          label: "Postman collection",
          enabled: false,
          data: undefined
        }
      }
    };
    expect(state).toEqual(expectedState);
  });
});
