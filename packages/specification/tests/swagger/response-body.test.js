const Specification = require("../../src/index");
const Request = require("@restqa/plugin-rest-api/src/rest-api/lib/api/request");
const Response = require("@restqa/plugin-rest-api/src/rest-api/lib/api/response");

describe("swagger - response body", () => {
  test("Add multiple  content type to the same response", () => {
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
        statusCode: "200",
        headers: {
          "content-type": "text/plain"
        },
        body: "hello world"
      }),
      scenario: {
        name: "Plain text response"
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
                  },
                  "text/plain": {
                    schema: {
                      type: "string",
                      example: "hello world"
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
