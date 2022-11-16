afterEach(() => {
  jest.resetModules();
});

describe("# rest-api.Generator", () => {
  test("throw an error if the parameter is empty", () => {
    const RestAPI = require("./index");
    return expect(RestAPI.Generator()).rejects.toThrow(
      new ReferenceError("Please provide an object containing your request")
    );
  });

  test("throw an error if the object doesn't contains the url", () => {
    const RestAPI = require("./index");
    const query = {};
    return expect(RestAPI.Generator(query)).rejects.toThrow(
      new ReferenceError("Please specify your url")
    );
  });

  test("throw an error if the method is not valid", () => {
    const RestAPI = require("./index");
    const query = {
      url: "http://www.example.com",
      method: "PUUT"
    };
    return expect(RestAPI.Generator(query)).rejects.toThrow(
      new TypeError(
        'The method "PUUT" is not valid, please use : GET, POST, PUT, PATCH, DELETE, OPTIONS or HEAD'
      )
    );
  });

  test("Use method get if it's not specified (not include host)", async () => {
    const got = require("got");
    got.mockResolvedValue({
      restqa: {
        statusCode: 200,
        req: {
          path: "/"
        },
        timings: {
          phases: {
            total: 1000
          }
        },
        headers: {
          "content-type": "application/json"
        },
        body: {
          foo: "bar",
          number: 12,
          booTrue: true,
          booFalse: false,
          null: null
        }
      }
    });
    jest.mock("got");
    const RestAPI = require("./index");
    const query = {
      url: "http://www.example.com?q=restqa",
      body: {
        hello: "world",
        bonjour: "le monde"
      }
    };
    const result = await RestAPI.Generator(query, false);
    const expectedResult = `
Given a request
  And the query strings:
    | q | restqa |
  And the payload:
  """
{
  "hello": "world",
  "bonjour": "le monde"
}
  """
When GET "/"
Then status = 200
  And the body:
  """
{
  "foo": "bar",
  "number": 12,
  "booTrue": true,
  "booFalse": false,
  "null": null
}
  """
`;
    expect(result).toEqual(expectedResult.trim());

    const expectedOptions = {
      pathname: "/",
      method: "GET",
      protocol: "http:",
      hostname: "www.example.com",
      searchParams: {
        q: "restqa"
      },
      json: {
        hello: "world",
        bonjour: "le monde"
      }
    };
    expect(got.mock.calls).toHaveLength(1);
    expect(got.mock.calls[0][0]).toEqual(
      expect.objectContaining(expectedOptions)
    );
  });

  test("Use method get if it's not specified", async () => {
    const got = require("got");
    got.mockResolvedValue({
      restqa: {
        statusCode: 200,
        req: {
          path: "/"
        },
        timings: {
          phases: {
            total: 1000
          }
        },
        headers: {
          "content-type": "application/json"
        },
        body: {
          foo: "bar",
          number: 12,
          booTrue: true,
          booFalse: false,
          null: null
        }
      }
    });
    jest.mock("got");
    const RestAPI = require("./index");
    const query = {
      url: "http://www.example.com?q=restqa",
      body: {
        hello: "world",
        bonjour: "le monde"
      }
    };
    const result = await RestAPI.Generator(query);
    const expectedResult = `
Given a request hosted on "http://www.example.com"
  And the query strings:
    | q | restqa |
  And the payload:
  """
{
  "hello": "world",
  "bonjour": "le monde"
}
  """
When GET "/"
Then status = 200
  And the body:
  """
{
  "foo": "bar",
  "number": 12,
  "booTrue": true,
  "booFalse": false,
  "null": null
}
  """
`;
    expect(result).toEqual(expectedResult.trim());

    const expectedOptions = {
      pathname: "/",
      method: "GET",
      protocol: "http:",
      hostname: "www.example.com",
      searchParams: {
        q: "restqa"
      },
      json: {
        hello: "world",
        bonjour: "le monde"
      }
    };
    expect(got.mock.calls).toHaveLength(1);
    expect(got.mock.calls[0][0]).toEqual(
      expect.objectContaining(expectedOptions)
    );
  });

  test("Get a form request body", async () => {
    const got = require("got");
    got.mockResolvedValue({
      restqa: {
        statusCode: 200,
        req: {
          path: "/"
        },
        timings: {
          phases: {
            total: 1000
          }
        },
        headers: {
          "content-type": "application/json"
        },
        body: {
          foo: "bar",
          number: 12,
          booTrue: true,
          booFalse: false,
          null: null
        }
      }
    });
    jest.mock("got");
    const RestAPI = require("./index");
    const query = {
      url: "http://www.example.com?q=restqa",
      method: "GET",
      headers: {
        "content-type": "multipart/form-data"
      },
      form: {
        hello: "world",
        bonjour: "le monde"
      }
    };
    const result = await RestAPI.Generator(query);
    const expectedResult = `
Given a request hosted on "http://www.example.com"
  And the headers:
    | content-type | multipart/form-data |
  And the query strings:
    | q | restqa |
  And the body (form):
    | hello | world |
    | bonjour | le monde |
When GET "/"
Then status = 200
  And the body:
  """
{
  "foo": "bar",
  "number": 12,
  "booTrue": true,
  "booFalse": false,
  "null": null
}
  """
`;
    expect(result).toEqual(expectedResult.trim());

    const FormData = require("form-data");
    const form = new FormData();
    form.append("hello", "world");
    form.append("bonjour", "le monde");

    const expectedOptions = {
      pathname: "/",
      method: "GET",
      protocol: "http:",
      hostname: "www.example.com",
      searchParams: {
        q: "restqa"
      }
    };
    expect(got.mock.calls).toHaveLength(1);
    expect(got.mock.calls[0][0]).toEqual(
      expect.objectContaining(expectedOptions)
    );
    expect(form.toString()).toEqual(got.mock.calls[0][0].body.toString());
  });

  test("No response body", async () => {
    const got = require("got");
    got.mockResolvedValue({
      restqa: {
        statusCode: 204,
        req: {
          path: "/"
        },
        timings: {
          phases: {
            total: 1000
          }
        },
        headers: {
          "content-type": "application/json"
        },
        body: null
      }
    });
    jest.mock("got");
    const RestAPI = require("./index");
    const query = {
      url: "http://www.example.com/logout",
      method: "DELETE",
      headers: {
        "x-api-key": "xxx-yyy-zzz",
        "x-foo": "bar"
      }
    };
    const result = await RestAPI.Generator(query);
    const expectedResult = `
Given a request hosted on "http://www.example.com"
  And the headers:
    | x-api-key | xxx-yyy-zzz |
    | x-foo | bar |
When DELETE "/logout"
Then status = 204
`;
    expect(result).toEqual(expectedResult.trim());

    const expectedOptions = {
      pathname: "/logout",
      method: "DELETE",
      protocol: "http:",
      hostname: "www.example.com"
    };
    expect(got.mock.calls).toHaveLength(1);
    expect(got.mock.calls[0][0]).toEqual(
      expect.objectContaining(expectedOptions)
    );
  });

  test("Basic auth and ignore ssl", async () => {
    const got = require("got");
    got.mockResolvedValue({
      restqa: {
        statusCode: 204,
        req: {
          path: "/"
        },
        timings: {
          phases: {
            total: 1000
          }
        },
        headers: {
          "content-type": "application/json"
        },
        body: null
      }
    });
    jest.mock("got");
    const RestAPI = require("./index");
    const query = {
      url: "http://www.example.com/logout",
      method: "DELETE",
      headers: {
        "x-api-key": "xxx-yyy-zzz"
      },
      user: {
        username: "john",
        password: "doe"
      },
      ignoreSsl: true
    };
    const result = await RestAPI.Generator(query);
    const expectedResult = `
Given a request hosted on "http://www.example.com"
  And ignore ssl
  And the headers:
    | x-api-key | xxx-yyy-zzz |
  And the basic auth "john" / "doe"
When DELETE "/logout"
Then status = 204
`;
    expect(result).toEqual(expectedResult.trim());

    const expectedOptions = {
      pathname: "/logout",
      method: "DELETE",
      protocol: "http:",
      hostname: "www.example.com",
      rejectUnauthorized: false
    };

    const expectedHeaders = {
      "x-api-key": "xxx-yyy-zzz"
    };
    expect(got.mock.calls).toHaveLength(1);
    expect(got.mock.calls[0][0]).toEqual(
      expect.objectContaining(expectedOptions)
    );
    expect(got.mock.calls[0][0].headers).toEqual(
      expect.objectContaining(expectedHeaders)
    );
  });

  test("Get a form request body with json response passed", async () => {
    const RestAPI = require("./index");
    const options = {
      request: {
        path: "/test",
        headers: {
          "content-type": "application/json"
        },
        method: "POST",
        query: {
          q: "restqa"
        },
        json: {
          hello: "world",
          bonjour: "le monde"
        }
      },
      response: {
        statusCode: 200,
        headers: {
          "content-type": "application/json"
        },
        body: {
          foo: "bar",
          number: 12,
          booTrue: true,
          booFalse: false,
          null: null
        }
      }
    };

    const result = await RestAPI.Generator(options);
    const expectedResult = `
Given a request
  And the headers:
    | content-type | application/json |
  And the query strings:
    | q | restqa |
  And the payload:
  """
{
  "hello": "world",
  "bonjour": "le monde"
}
  """
When POST "/test"
Then status = 200
  And the body:
  """
{
  "foo": "bar",
  "number": 12,
  "booTrue": true,
  "booFalse": false,
  "null": null
}
  """
`;
    expect(result).toEqual(expectedResult.trim());
  });
});
