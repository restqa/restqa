describe("#StepDefinition - given - functions", () => {
  const When = require("./functions");

  test("Configuration", () => {
    const fns = Object.keys(When);
    expect(fns).toHaveLength(1);
    const expectedFunctions = ["callApi"];
    expect(fns).toEqual(expectedFunctions);
  });

  describe("Default Functions", () => {
    test("callApi", async () => {
      const $this = {
        api: {
          run: jest.fn().mockResolvedValue(true),
          getCurl: () => "curl http://localhost"
        },
        attach: jest.fn()
      };

      await When.callApi.call($this);
      expect($this.api.run.mock.calls).toHaveLength(1);
      expect($this.api.run.mock.calls[0][0]).toBeUndefined();
      expect($this.attach.mock.calls).toHaveLength(1);
      expect($this.attach.mock.calls[0][0]).toEqual("curl http://localhost");
    });
  });
});
