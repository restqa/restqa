afterEach(() => {
  jest.resetModules();
});

describe("# restqapi.Generator", () => {
  test("throw an error if the parameter is empty", () => {
    const Restqapi = require("./index");
    return expect(Restqapi.Generator()).rejects.toThrow(
      new ReferenceError("Please provide an object containing your request")
    );
  });

  test("throw an error if the object doesn't contains the url", () => {
    const Restqapi = require("./index");
    const query = {};
    return expect(Restqapi.Generator(query)).rejects.toThrow(
      new ReferenceError("Please specify your url")
    );
  });

  test("throw an error if the method is not valid", () => {
    const Restqapi = require("./index");
    const query = {
      url: "http://www.example.com",
      method: "PUUT"
    };
    return expect(Restqapi.Generator(query)).rejects.toThrow(
      new TypeError(
        'The method "PUUT" is not valid, please use : GET, POST, PUT, PATCH, DELETE, OPTIONS or HEAD'
      )
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
    const Restqapi = require("./index");
    const query = {
      url: "http://www.example.com?q=restqa",
      body: {
        hello: "world",
        bonjour: "le monde"
      }
    };
    const result = await Restqapi.Generator(query);
    const expectedResult = `
Given I have the api gateway hosted on "http://www.example.com"
  And I have the path "/"
  And I have the method "GET"
  And the query parameter contains "q" as "restqa"
  And the payload:
  """
{
  "hello": "world",
  "bonjour": "le monde"
}
  """
When I run the API
Then I should receive a response with the status 200
  And the response body should be equal to:
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
    const Restqapi = require("./index");
    const query = {
      url: "http://www.example.com?q=restqa",
      headers: {
        "content-type": "multipart/form-data"
      },
      form: {
        hello: "world",
        bonjour: "le monde"
      }
    };
    const result = await Restqapi.Generator(query);
    const expectedResult = `
Given I have the api gateway hosted on "http://www.example.com"
  And I have the path "/"
  And I have the method "GET"
  And the header contains "content-type" as "multipart/form-data"
  And the query parameter contains "q" as "restqa"
  And I add the form value "hello" as "world"
  And I add the form value "bonjour" as "le monde"
When I run the API
Then I should receive a response with the status 200
  And the response body should be equal to:
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
    const Restqapi = require("./index");
    const query = {
      url: "http://www.example.com/logout",
      method: "DELETE",
      headers: {
        "x-api-key": "xxx-yyy-zzz",
        "x-foo": "bar"
      }
    };
    const result = await Restqapi.Generator(query);
    const expectedResult = `
Given I have the api gateway hosted on "http://www.example.com"
  And I have the path "/logout"
  And I have the method "DELETE"
  And the header contains "x-api-key" as "xxx-yyy-zzz"
  And the header contains "x-foo" as "bar"
When I run the API
Then I should receive a response with the status 204
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
    const Restqapi = require("./index");
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
    const result = await Restqapi.Generator(query);
    const expectedResult = `
Given I have the api gateway hosted on "http://www.example.com"
  And I want to ignore the ssl certificate
  And I have the path "/logout"
  And I have the method "DELETE"
  And the header contains "x-api-key" as "xxx-yyy-zzz"
  And I have the basic auth user "john" pass "doe"
When I run the API
Then I should receive a response with the status 204
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
    const Restqapi = require("./index");
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

    const result = await Restqapi.Generator(options);
    const expectedResult = `
Given I have the api gateway
  And I have the path "/test"
  And I have the method "POST"
  And the header contains "content-type" as "application/json"
  And the query parameter contains "q" as "restqa"
  And the payload:
  """
{
  "hello": "world",
  "bonjour": "le monde"
}
  """
When I run the API
Then I should receive a response with the status 200
  And the response body should be equal to:
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
