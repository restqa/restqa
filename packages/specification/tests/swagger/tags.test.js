const Specification = require("../../src/index");
const Request = require("@restqa/plugin-rest-api/src/rest-api/lib/api/request");
const Response = require("@restqa/plugin-rest-api/src/rest-api/lib/api/response");

describe("swagger - tags", () => {
  test("Add the default ttag to a route", () => {
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

  test("Add a tag to a route", () => {
    const options = {
      info: {
        version: "1.0.0",
        description: "My description 1",
        title: "My fixture 1"
      },
      tags: {
        users: ["/users"]
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
            tags: ["users"],
            summary: "Successfull hello world",
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

  test("Add multiple tags to a route", () => {
    const options = {
      info: {
        version: "1.0.0",
        description: "My description 1",
        title: "My fixture 1"
      },
      tags: {
        users: ["/users"],
        account: ["/users"]
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
            tags: ["users", "account"],
            summary: "Successfull hello world",
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
