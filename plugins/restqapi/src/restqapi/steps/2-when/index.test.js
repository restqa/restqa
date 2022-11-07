beforeEach(() => {
  jest.resetModules();
});

describe("#StepDefinition - when", () => {
  test("Configuration", () => {
    const when = require("./index");
    expect(Array.isArray(when)).toBeTruthy();
    expect(when).toHaveLength(1);
  });

  test("Each steps should contains the expected value", () => {
    const when = require("./index");
    when.forEach((item) => {
      expect(item).toHaveLength(4);
      expect(typeof item[0]).toBe("string");
      expect(typeof item[1]).toBe("function");
      expect(typeof item[2]).toBe("string");
      expect(typeof item[3]).toBe("string");
    });
  });
});
