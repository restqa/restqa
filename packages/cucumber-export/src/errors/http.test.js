beforeEach(() => {
  jest.resetModules();
});

describe.skip("#http - src/errors", () => {
  test("toString", () => {
    const Http = require("./http");
    const gotError = new Error("got Msg");
    gotError.response = {
      statusCode: 503,
      requestUrl: "http://dump.io/test",
      body: {
        err: "foo/bar"
      },
      headers: {
        foo: "bar"
      }
    };

    const err = new Http("MY REPORT", gotError);

    const expectedResponse = [
      "formatter : MY REPORT",
      'formatterMessage : [MY REPORT][503] - http://dump.io/test : {"err":"foo/bar"}',
      "message : got Msg",
      "statusCode : 503",
      "url : http://dump.io/test",
      'responseBody : {"err":"foo/bar"}',
      'responseHeaders : {"foo":"bar"}',
      "stack : " + gotError.stack.replace("20:17", "8:22")
    ].join("\n");
    expect(err.toString()).toEqual(expectedResponse);
  });

  test("toString when response is not defined", () => {
    const Http = require("./http");
    const gotError = new Error("got Msg");
    gotError.code = "ENOTFOUND";

    const err = new Http("MY REPORT", gotError);

    const expectedResponse = [
      "formatter : MY REPORT",
      "formatterMessage : [MY REPORT][ENOTFOUND] -  : null",
      "message : got Msg",
      "statusCode : ENOTFOUND",
      "url : ",
      "responseBody : null",
      "responseHeaders : null",
      "stack : " + gotError.stack.replace("40:17", "37:22")
    ].join("\n");
    expect(err.toString()).toEqual(expectedResponse);
  });
});
