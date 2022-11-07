afterEach(() => {
  jest.resetModules();
});

describe("#StepDefinition - index", () => {
  test("Configuration", () => {
    const fnGiven = require("./1-given");
    jest.mock("./1-given");
    fnGiven.push([1]);

    const fnWhen = require("./2-when");
    jest.mock("./2-when");
    fnWhen.push([2]);

    const fnThen = require("./3-then");
    jest.mock("./3-then");
    fnThen.push([3]);

    const stepDefinition = require("./index");
    const obj = {
      Given: jest.fn(),
      When: jest.fn(),
      Then: jest.fn()
    };

    stepDefinition(obj);

    expect(obj.Given.mock.calls).toHaveLength(1);
    expect(obj.Given.mock.calls[0][0]).toEqual(1);
    expect(obj.When.mock.calls).toHaveLength(1);
    expect(obj.When.mock.calls[0][0]).toEqual(2);
    expect(obj.Then.mock.calls).toHaveLength(1);
    expect(obj.Then.mock.calls[0][0]).toEqual(3);
  });
});
