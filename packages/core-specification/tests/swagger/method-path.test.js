const Specification = require("../../src/index");
const Request = require("@restqa/plugin-rest-api/src/rest-api/lib/api/request");
const Response = require("@restqa/plugin-rest-api/src/rest-api/lib/api/response");

describe("swagger - method path", () => {
  test("Add new path GET path", () => {
    const options = {
      info: {
        version: "1.0.0",
        description: "My description 1",
        title: "My fixture 1"
      }
    };

    const instance = new Specification(options);

    const api = {
      request: Request("http://localhost"),
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
        "/": {
          get: {
            operationId: "get",
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

  test("Add 2 paths GET + DELETE", () => {
    const options = {
      info: {
        version: "1.0.0",
        description: "My description 1",
        title: "My fixture 1"
      }
    };

    const instance = new Specification(options);

    const api = {
      request: Request("http://localhost"),
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
        statusCode: "204",
        headers: {},
        body: ""
      }),
      scenario: {
        name: "Deleting a user"
      }
    };
    api2.request.setMethod("DELETE");
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
        "/": {
          get: {
            operationId: "get",
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
        },
        "/users": {
          delete: {
            operationId: "deleteUsers",
            tags: ["Tested by RestQA"],
            summary: "Deleting a user",
            responses: {
              204: {
                description: "No Content"
              }
            }
          }
        }
      }
    };

    expect(result).toEqual(expected);
  });

  test("Add 2 paths but 1 should be excluded", () => {
    const options = {
      info: {
        version: "1.0.0",
        description: "My description 1",
        title: "My fixture 1"
      },
      excludes: {
        routes: [
          {
            method: "delete",
            path: "/users"
          }
        ]
      }
    };

    const instance = new Specification(options);

    const api = {
      request: Request("http://localhost"),
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
        statusCode: "204",
        headers: {},
        body: ""
      }),
      scenario: {
        name: "Deleting a user"
      }
    };
    api2.request.setMethod("DELETE");
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
        "/": {
          get: {
            operationId: "get",
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

  test("Add 2 paths and have dynamic parameters", () => {
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
      request: Request("http://localhost/987654"),
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
      request: Request("http://localhost/users/123456"),
      response: Response({
        statusCode: "204",
        headers: {},
        body: ""
      }),
      scenario: {
        name: "Deleting a user"
      }
    };
    api2.request.setMethod("DELETE");
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
        "/{id}": {
          get: {
            operationId: "getId",
            tags: ["Tested by RestQA"],
            summary: "Successfull hello world",
            parameters: [
              {
                in: "path",
                name: "id",
                required: true,
                schema: {
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
        },
        "/users/{userId}": {
          delete: {
            operationId: "deleteUsersUserId",
            tags: ["Tested by RestQA"],
            summary: "Deleting a user",
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
            responses: {
              204: {
                description: "No Content"
              }
            }
          }
        }
      }
    };
    expect(result).toEqual(expected);
  });

  test("Add 2 paths and have dynamic parameters (explicit regex)", () => {
    const options = {
      info: {
        version: "1.0.0",
        description: "My description 1",
        title: "My fixture 1"
      },
      matches: {
        ids: ["/\\d{6}/g"]
      }
    };

    const instance = new Specification(options);

    const api = {
      request: Request("http://localhost/987654"),
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
      request: Request("http://localhost/users/123456"),
      response: Response({
        statusCode: "204",
        headers: {},
        body: ""
      }),
      scenario: {
        name: "Deleting a user"
      }
    };
    api2.request.setMethod("DELETE");
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
        "/{id}": {
          get: {
            operationId: "getId",
            tags: ["Tested by RestQA"],
            summary: "Successfull hello world",
            parameters: [
              {
                in: "path",
                name: "id",
                required: true,
                schema: {
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
        },
        "/users/{userId}": {
          delete: {
            operationId: "deleteUsersUserId",
            tags: ["Tested by RestQA"],
            summary: "Deleting a user",
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
            responses: {
              204: {
                description: "No Content"
              }
            }
          }
        }
      }
    };
    expect(result).toEqual(expected);
  });

  test("Add 2 paths and have 2 dynamic parameters in the same path, but exclude one using dynamic name", () => {
    const options = {
      info: {
        version: "1.0.0",
        description: "My description 1",
        title: "My fixture 1"
      },
      excludes: {
        routes: [
          {
            method: "get",
            path: "/{id}"
          }
        ]
      },
      matches: {
        ids: ["\\d{6}", "\\d{10}"]
      }
    };

    const instance = new Specification(options);

    const api = {
      request: Request("http://localhost/987654"),
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
      request: Request("http://localhost/users/123456/devices/1234567890"),
      response: Response({
        statusCode: "204",
        headers: {},
        body: ""
      }),
      scenario: {
        name: "Deleting a user"
      }
    };
    api2.request.setMethod("DELETE");
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
        "/users/{userId}/devices/{deviceId}": {
          delete: {
            operationId: "deleteUsersUserIdDevicesDeviceId",
            tags: ["Tested by RestQA"],
            summary: "Deleting a user",
            parameters: [
              {
                in: "path",
                name: "userId",
                required: true,
                schema: {
                  type: "string"
                }
              },
              {
                in: "path",
                name: "deviceId",
                required: true,
                schema: {
                  type: "string"
                }
              }
            ],
            responses: {
              204: {
                description: "No Content"
              }
            }
          }
        }
      }
    };
    expect(result).toEqual(expected);
  });
});
