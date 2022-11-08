beforeEach(() => {
  jest.resetModules();
});

describe("#StepDefinition - given", () => {
  test("Configuration", () => {
    const given = require("./index");
    expect(Array.isArray(given)).toBeTruthy();
    expect(given).toHaveLength(44);
  });

  test("Each steps should contains the expected value", () => {
    const given = require("./index");
    given.forEach((item) => {
      expect(item).toHaveLength(4);
      expect(typeof item[0]).toBe("string");
      expect(typeof item[1]).toBe("function");
      expect(typeof item[2]).toBe("string");
      expect(typeof item[3]).toBe("string");
    });
  });
});
