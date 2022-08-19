describe("#lib - specification", () => {
  test("throw an error if the configuration doesn't contains the tool", () => {
    const Specification = require("./index");
    const config = {
      specification: {}
    };
    expect(() => new Specification(config)).toThrow(
      'The specification property "tool" should be specify. (available: swagger)'
    );
  });
});
