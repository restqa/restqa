const Specification = require("../src/index");

describe("Specification", () => {
  test("Error if the tool is not in allowd", () => {
    const options = {
      tool: "test"
    };
    expect(() => {
      new Specification(options); // eslint-disable-line no-new
    }).toThrow(
      'The specification property "tool" should be specify. (available: swagger)'
    );
  });
});
