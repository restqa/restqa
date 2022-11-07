beforeEach(() => {
  jest.resetModules();
});

describe("#lib - modules", () => {
  test("modules", () => {
    const modules = require("./index");
    expect(Object.keys(modules)).toEqual(["Api", "Generator"]);
  });
});
