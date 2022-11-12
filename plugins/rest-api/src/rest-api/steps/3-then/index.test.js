beforeEach(() => {
  jest.resetModules();
});

describe("#StepDefinition - then", () => {
  test("Configuration", () => {
    const then = require("./index");
    expect(Array.isArray(then)).toBeTruthy();
    expect(then).toHaveLength(48);
  });

  test("Each steps should contains the expected value", () => {
    const then = require("./index");
    then.forEach((item) => {
      expect(item).toHaveLength(4);
      expect(typeof item[0]).toBe("string");
      expect(typeof item[1]).toBe("function");
      expect(typeof item[2]).toBe("string");
      expect(typeof item[3]).toBe("string");
    });
  });
});
