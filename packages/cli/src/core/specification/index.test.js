describe("#lib - specification", () => {
  test("throw an error if the configuration contains the tool an incompatible tool", () => {
    const Specification = require("./index");
    const config = {
      specification: {
        tool: "raml"
      }
    };
    expect(() => new Specification(config)).toThrow(
      'The specification property "tool" should be specify. (available: swagger)'
    );
  });
});
