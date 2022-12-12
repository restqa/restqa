const Specification = require("../../src/index");

test("Should have all the headers information", () => {
  const options = {
    info: {
      version: "1.0.0",
      description: "My description 1",
      title: "My fixture 1"
    }
  };

  const instance = new Specification(options);
  const result = instance.format();

  const expected = {
    info: {
      description: "My description 1",
      title: "My fixture 1",
      version: "1.0.0"
    },
    openapi: "3.0.0",
    paths: {}
  };

  expect(result).toEqual(expected);
});
