beforeEach(() => {
  jest.resetModules();
});

describe("#index - src/errors", () => {
  test("Available modules", () => {
    const Index = require("./index");
    const modules = Object.keys(Index);
    expect(modules).toEqual(["DEFAULT", "HTTP"]);
  });
});
