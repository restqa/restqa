const Specification = require("../../src/index");
const Request = require("@restqa/plugin-rest-api/src/rest-api/lib/api/request");
const Response = require("@restqa/plugin-rest-api/src/rest-api/lib/api/response");

describe("swagger - query strings", () => {
  test("Add a query string to the request", () => {
    const options = {
      info: {
        version: "1.0.0",
        description: "My description 1",
        title: "My fixture 1"
      }
    };

    const instance = new Specification(options);

    const api = {
      request: Request("http://localhost/users"),
      response: Response({
        statusCode: "200",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          hello: "world"
        })
      }),
      scenario: {
        name: "Successfull hello world"
      }
    };

    api.request.setQueryString("name", "john");

    instance.add(api);

    const result = instance.format();

    const expected = {
      info: {
        description: "My description 1",
        title: "My fixture 1",
        version: "1.0.0"
      },
      openapi: "3.0.0",
      paths: {
        "/users": {
          get: {
            operationId: "getUsers",
            tags: ["Tested by RestQA"],
            summary: "Successfull hello world",
            parameters: [
              {
                in: "query",
                name: "name",
                required: false,
                schema: {
                  example: "john",
                  type: "string"
                }
              }
            ],
            responses: {
              200: {
                description: "OK",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        hello: {
                          example: "world",
                          type: "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    };

    expect(result).toEqual(expected);
  });

  test("Add 2 query string but ignore one", () => {
    const options = {
      info: {
        version: "1.0.0",
        description: "My description 1",
        title: "My fixture 1"
      },
      excludes: {
        queries: ["lastname"]
      }
    };

    const instance = new Specification(options);

    const api = {
      request: Request("http://localhost/users"),
      response: Response({
        statusCode: "200",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          hello: "world"
        })
      }),
      scenario: {
        name: "Successfull hello world"
      }
    };

    api.request.setQueryString("firstname", "john");
    api.request.setQueryString("lastname", "doe");

    instance.add(api);

    const result = instance.format();

    const expected = {
      info: {
        description: "My description 1",
        title: "My fixture 1",
        version: "1.0.0"
      },
      openapi: "3.0.0",
      paths: {
        "/users": {
          get: {
            operationId: "getUsers",
            tags: ["Tested by RestQA"],
            summary: "Successfull hello world",
            parameters: [
              {
                in: "query",
                name: "firstname",
                required: false,
                schema: {
                  example: "john",
                  type: "string"
                }
              }
            ],
            responses: {
              200: {
                description: "OK",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        hello: {
                          example: "world",
                          type: "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    };

    expect(result).toEqual(expected);
  });
});
