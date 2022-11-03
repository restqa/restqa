beforeEach(() => {
  jest.resetModules();
});

describe("# API  Response", () => {
  test("methods", () => {
    const Response = require("./response");

    const result = {
      request: {
        method: "POST"
      },
      statusCode: 201,
      headers: {
        "content-type": "application/json"
      },
      body: {
        foo: "bar"
      },
      timing: 2000
    };

    const response = Response(result);

    const expectedMethods = [
      "request",
      "timing",
      "statusCode",
      "headers",
      "body",
      "findInBody",
      "findInHeader",
      "getResult",
      "getOptions",
      "isJson",
      "dotBody"
    ];

    expect(Object.keys(response)).toEqual(expectedMethods);
    expect(response.request).toEqual({method: "POST"});
    expect(response.timing).toEqual(2000);
    expect(response.statusCode).toEqual(201);
    expect(response.headers).toEqual({"content-type": "application/json"});
    expect(response.body).toEqual({foo: "bar"});
    expect(response.findInBody).toBeInstanceOf(Function);
    expect(response.findInHeader).toBeInstanceOf(Function);
  });

  test("findInBody", () => {
    const Response = require("./response");

    const result = {
      request: {
        method: "POST"
      },
      statusCode: 201,
      headers: {
        "content-type": "application/json"
      },
      body: {
        foo: {
          foo: "bar"
        }
      },
      timing: 2000
    };

    const response = Response(result);

    expect(response.findInBody("foo.foo")).toEqual("bar");
    expect(response.findInBody("$.foo.foo")).toEqual("bar");
    expect(response.findInBody("$.o")).toBeUndefined();
    expect(response.findInBody("o")).toBeUndefined();
  });

  test("findInBody - non json", () => {
    const Response = require("./response");

    const result = {
      request: {
        method: "POST"
      },
      statusCode: 201,
      headers: {},
      timing: 2000
    };

    const response = Response(result);

    expect(response.findInBody("$.o")).toBeUndefined();
    expect(response.findInBody("o")).toBeUndefined();
  });

  test("findInBody - json but no body", () => {
    const Response = require("./response");

    const result = {
      request: {
        method: "POST"
      },
      statusCode: 201,
      headers: {
        "content-type": "application/json"
      },
      timing: 2000
    };

    const response = Response(result);

    expect(response.findInBody("$.o")).toBeUndefined();
    expect(response.findInBody("o")).toBeUndefined();
  });

  test("findInHeader", () => {
    const Response = require("./response");

    const result = {
      request: {
        method: "POST"
      },
      statusCode: 201,
      headers: {
        "content-type": "application/json",
        "x-req-id": "zz-xx-yy"
      },
      body: {
        foo: {
          foo: "bar"
        }
      },
      timing: 2000
    };

    const response = Response(result);

    expect(response.findInHeader("X-req-id")).toEqual("zz-xx-yy");
    expect(response.findInHeader("x-req-id")).toEqual("zz-xx-yy");
    expect(response.findInHeader("foo")).toBeUndefined();
  });

  test("getResult", () => {
    const Response = require("./response");

    const result = {
      request: {
        method: "POST"
      },
      statusCode: 201,
      headers: {
        "content-type": "application/json",
        "x-req-id": "zz-xx-yy"
      },
      body: {
        foo: {
          foo: "bar"
        }
      },
      timing: 2000
    };

    const response = Response(result);

    expect(response.getResult()).toEqual(result);
  });

  test("getOptions", () => {
    const Response = require("./response");

    const result = {
      request: {
        method: "POST"
      },
      statusCode: 201,
      headers: {
        "content-type": "application/json",
        "x-req-id": "zz-xx-yy"
      },
      body: {
        foo: {
          foo: "bar"
        }
      },
      timing: 2000
    };

    const response = Response(result);

    expect(response.getOptions()).toEqual({
      statusCode: 201,
      headers: {
        "content-type": "application/json",
        "x-req-id": "zz-xx-yy"
      },
      body: {
        foo: {
          foo: "bar"
        }
      },
      timing: 2000
    });
  });

  test("isJson - true", () => {
    const Response = require("./response");

    const result = {
      request: {
        method: "POST"
      },
      statusCode: 201,
      headers: {
        "content-type": "application/json",
        "x-req-id": "zz-xx-yy"
      },
      body: {
        foo: {
          foo: "bar"
        }
      },
      timing: 2000
    };

    const response = Response(result);

    expect(response.isJson).toBe(true);
  });

  test("isJson - false", () => {
    const Response = require("./response");

    const result = {
      request: {
        method: "POST"
      },
      statusCode: 201,
      headers: {
        "content-type": "application/text",
        "x-req-id": "zz-xx-yy"
      },
      body: {
        foo: {
          foo: "bar"
        }
      },
      timing: 2000
    };

    const response = Response(result);

    expect(response.isJson).toBe(false);
  });
});
