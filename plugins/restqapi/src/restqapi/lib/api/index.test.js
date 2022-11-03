beforeEach(() => {
  jest.resetModules();
});

describe("# api - Module", () => {
  test("init", () => {
    const Api = require("./index");
    const options = {
      config: {
        url: "http://test.com"
      }
    };
    const instance = new Api(options);

    expect(Object.keys(instance)).toHaveLength(6);
    expect(Object.keys(instance)).toEqual([
      "config",
      "request",
      "response",
      "run",
      "toJSON",
      "getCurl"
    ]);
    expect(instance.config).toEqual({url: "http://test.com"});
    expect(instance.request).toBeInstanceOf(Object);
    expect(instance.response).toBeNull();
    expect(instance.run).toBeInstanceOf(Function);
  });

  test("run - successfull call", async () => {
    const got = require("got");
    jest.mock("got", () => {
      return jest.fn().mockResolvedValue({
        restqa: {
          statusCode: 201
        }
      });
    });

    const Response = require("./response");
    jest.mock("./response", () => {
      return jest.fn().mockReturnValue({
        status: 201
      });
    });

    const Api = require("./index");
    const options = {
      config: {
        url: "http://test.com"
      }
    };

    const instance = new Api(options);
    await instance.run();

    expect(got.mock.calls).toHaveLength(1);
    expect(got.mock.calls[0][0]).toEqual(instance.request.getOptions());

    expect(Response.mock.calls).toHaveLength(1);
    expect(Response.mock.calls[0][0]).toEqual({statusCode: 201});
    expect(instance.response).toEqual({status: 201});
  });

  test("run - successfull call But api response is not a 2XX", async () => {
    const got = require("got");
    jest.mock("got", () => {
      return jest.fn().mockRejectedValue({
        response: {
          restqa: {
            statusCode: 401
          }
        }
      });
    });

    const Response = require("./response");
    jest.mock("./response", () => {
      return jest.fn().mockReturnValue({
        status: 401
      });
    });

    const Api = require("./index");
    const options = {
      config: {
        url: "http://test.com"
      }
    };

    const instance = new Api(options);
    await instance.run();

    expect(got.mock.calls).toHaveLength(1);
    expect(got.mock.calls[0][0]).toEqual(instance.request.getOptions());

    expect(Response.mock.calls).toHaveLength(1);
    expect(Response.mock.calls[0][0]).toEqual({statusCode: 401});
    expect(instance.response).toEqual({status: 401});
  });

  test("run - unsuccessfull call (random error)", async () => {
    const got = require("got");
    jest.mock("got", () => {
      return jest.fn().mockRejectedValue(new Error("Random error"));
    });

    const Api = require("./index");
    const options = {
      config: {
        url: "http://test.com"
      }
    };

    const instance = new Api(options);
    await expect(instance.run()).rejects.toThrow("Random error");

    expect(got.mock.calls).toHaveLength(1);
    expect(got.mock.calls[0][0]).toEqual(instance.request.getOptions());

    expect(instance.response).toBeNull();
  });

  test("toJson", async () => {
    const got = require("got");
    jest.mock("got", () => {
      return jest.fn().mockRejectedValue({
        response: {
          restqa: {
            statusCode: 401
          }
        }
      });
    });

    jest.mock("./response", () => {
      return jest.fn().mockReturnValue({
        status: 401,
        getResult: () => {
          return {
            "my-result": "123"
          };
        }
      });
    });

    const Api = require("./index");
    const options = {
      config: {
        url: "http://test.com"
      }
    };

    const instance = new Api(options);
    await instance.run();
    const result = instance.toJSON();

    expect(got.mock.calls).toHaveLength(1);
    expect(got.mock.calls[0][0]).toEqual(instance.request.getOptions());

    expect(result).toEqual({
      request: instance.request.getOptions(),
      response: {
        "my-result": "123"
      },
      curl: "curl -X GET --url http://test.com/"
    });
  });

  test("toJson when throw Error", async () => {
    const got = require("got");
    jest.mock("got", () => {
      return jest.fn().mockRejectedValue(new Error("the error"));
    });

    const Api = require("./index");
    const options = {
      config: {
        url: "http://test.com"
      }
    };

    const instance = new Api(options);
    await expect(instance.run()).rejects.toThrow("the error");
    const result = instance.toJSON();

    expect(got.mock.calls).toHaveLength(1);
    expect(got.mock.calls[0][0]).toEqual(instance.request.getOptions());

    expect(result).toEqual({
      request: instance.request.getOptions(),
      response: null,
      error: "the error",
      curl: "curl -X GET --url http://test.com/"
    });
  });

  describe("get curl command (default method: GET)", () => {
    test("curl with url", () => {
      const Api = require("./index");
      const options = {
        config: {
          url: "http://test.com"
        }
      };
      const instance = new Api(options);
      const result = instance.getCurl();
      expect(result).toEqual("curl -X GET --url http://test.com/");
    });

    test("curl using POST method", () => {
      const Api = require("./index");
      const options = {
        config: {
          url: "http://test.com"
        }
      };
      const instance = new Api(options);
      instance.request.setMethod("POST");
      const result = instance.getCurl();
      expect(result).toEqual("curl -X POST --url http://test.com/");
    });

    test("curl using DELETE method and ignore ssl", () => {
      const Api = require("./index");
      const options = {
        config: {
          url: "http://test.com"
        }
      };
      const instance = new Api(options);
      instance.request.setMethod("DELETE");
      instance.request.ignoreSsl();

      const result = instance.getCurl();
      expect(result).toEqual("curl -X DELETE -k --url http://test.com/");
    });

    test("curl using DELETE method and have one query string", () => {
      const Api = require("./index");
      const options = {
        config: {
          url: "http://test.com"
        }
      };
      const instance = new Api(options);
      instance.request.setMethod("DELETE");
      instance.request.setQueryString("filter", "name");

      const result = instance.getCurl();
      expect(result).toEqual(
        "curl -X DELETE --url http://test.com/?filter=name"
      );
    });

    test("curl using DELETE method and have multiple query string", () => {
      const Api = require("./index");
      const options = {
        config: {
          url: "http://test.com"
        }
      };
      const instance = new Api(options);
      instance.request.setMethod("DELETE");
      instance.request.setQueryString("filter", "name");
      instance.request.setQueryString("sort", "id");
      instance.request.setQueryString("offset", "10");

      const result = instance.getCurl();
      expect(result).toEqual(
        "curl -X DELETE --url http://test.com/?filter=name&sort=id&offset=10"
      );
    });

    test("curl add path and have multiple query string", () => {
      const Api = require("./index");
      const options = {
        config: {
          url: "http://test.com"
        }
      };
      const instance = new Api(options);
      instance.request.setPath("/accounts");
      instance.request.setQueryString("filter", "name");
      instance.request.setQueryString("sort", "id");
      instance.request.setQueryString("offset", "10");

      const result = instance.getCurl();
      expect(result).toEqual(
        "curl -X GET --url http://test.com/accounts?filter=name&sort=id&offset=10"
      );
    });

    test("curl add 1 header", () => {
      const Api = require("./index");
      const options = {
        config: {
          url: "http://test.com"
        }
      };
      const instance = new Api(options);
      instance.request.setPath("/accounts");
      instance.request.setHeader("authorization", "Bearer xxx-yyy-zzzz");

      const result = instance.getCurl();
      expect(result).toEqual(
        'curl -X GET -H "authorization: Bearer xxx-yyy-zzzz" --url http://test.com/accounts'
      );
    });

    test("curl multiple headers", () => {
      const Api = require("./index");
      const options = {
        config: {
          url: "http://test.com"
        }
      };
      const instance = new Api(options);
      instance.request.setPath("/accounts");
      instance.request.setHeader("authorization", "Bearer xxx-yyy-zzzz");
      instance.request.setHeader("x-apikey", "my-random-apikey");

      const result = instance.getCurl();
      expect(result).toEqual(
        'curl -X GET -H "authorization: Bearer xxx-yyy-zzzz" -H "x-apikey: my-random-apikey" --url http://test.com/accounts'
      );
    });

    test("curl add json payload", () => {
      const Api = require("./index");
      const options = {
        config: {
          url: "http://test.com"
        }
      };
      const instance = new Api(options);
      instance.request.setPath("/accounts");
      instance.request.setMethod("POST");
      instance.request.setHeader("x-request-id", "foo-bar");
      instance.request.setPayload({type: "page"});

      const result = instance.getCurl();
      expect(result).toEqual(
        'curl -X POST -H "x-request-id: foo-bar" -H "Content-Type: application/json" --data \'{"type":"page"}\' --url http://test.com/accounts'
      );
    });

    test("curl add form field", () => {
      const Api = require("./index");
      const options = {
        config: {
          url: "http://test.com"
        }
      };
      const instance = new Api(options);
      instance.request.setPath("/accounts");
      instance.request.setMethod("POST");
      instance.request.addFormField("type", "page");
      instance.request.addFormField("name", "john doe");

      const result = instance.getCurl();
      expect(result).toEqual(
        "curl -X POST -H \"Content-Type: application/x-www-form-urlencoded\" --data 'type=page' --data 'name=john doe' --url http://test.com/accounts"
      );
    });

    test("capitalize curl methods", () => {
      const Api = require("./index");
      const options = {
        config: {
          url: "http://test.com:8083"
        }
      };
      const instance = new Api(options);
      instance.request.setMethod("get");
      const result = instance.getCurl();
      expect(result).toEqual("curl -X GET --url http://test.com:8083/");
    });
  });
});
