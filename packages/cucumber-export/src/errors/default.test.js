beforeEach(() => {
  jest.resetModules();
});

describe("#default - src/errors", () => {
  test("toString", () => {
    const Default = require("./default");
    const error = new Error("got Msg");

    const err = new Default("MY REPORT", error);

    const expectedResponse = [
      "formatter : MY REPORT",
      "formatterMessage : [MY REPORT] - got Msg",
      "message : got Msg",
      "stack : " + error.stack.replace("10:17", "8:19")
    ].join("\n");
    expect(err.toString()).toEqual(expectedResponse);
  });
});
