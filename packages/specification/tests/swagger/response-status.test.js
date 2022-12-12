const Specification = require("../../src/index");
const Request = require("@restqa/plugin-rest-api/src/rest-api/lib/api/request");
const Response = require("@restqa/plugin-rest-api/src/rest-api/lib/api/response");

describe("swagger - response status", () => {
  test("Add multiple status to the same endpoint", () => {
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

    const api2 = {
      request: Request("http://localhost/users"),
      response: Response({
        statusCode: "403",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          message: "You are not allowed to use this resource"
        })
      }),
      scenario: {
        name: "Forbiden use case"
      }
    };
    instance.add(api2);

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
              },
              403: {
                description: "Forbidden",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        message: {
                          example: "You are not allowed to use this resource",
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

  test("Add multiple status to the same endpoint (dynamic ids)", () => {
    const options = {
      info: {
        version: "1.0.0",
        description: "My description 1",
        title: "My fixture 1"
      },
      matches: {
        ids: ["\\d{6}"]
      }
    };

    const instance = new Specification(options);

    const api = {
      request: Request("http://localhost/users/432232"),
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

    const api2 = {
      request: Request("http://localhost/users/434928"),
      response: Response({
        statusCode: "403",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          message: "You are not allowed to use this resource"
        })
      }),
      scenario: {
        name: "Forbiden use case"
      }
    };
    instance.add(api2);

    const result = instance.format();

    const expected = {
      info: {
        description: "My description 1",
        title: "My fixture 1",
        version: "1.0.0"
      },
      openapi: "3.0.0",
      paths: {
        "/users/{userId}": {
          get: {
            operationId: "getUsersUserId",
            tags: ["Tested by RestQA"],
            parameters: [
              {
                in: "path",
                name: "userId",
                required: true,
                schema: {
                  type: "string"
                }
              }
            ],
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
              },
              403: {
                description: "Forbidden",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        message: {
                          example: "You are not allowed to use this resource",
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
