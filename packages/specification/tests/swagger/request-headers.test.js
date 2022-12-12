const Specification = require("../../src/index");
const Request = require("@restqa/plugin-rest-api/src/rest-api/lib/api/request");
const Response = require("@restqa/plugin-rest-api/src/rest-api/lib/api/response");

describe("swagger - request headers", () => {
  test("Add a header to the request, and hide another one", () => {
    const options = {
      info: {
        version: "1.0.0",
        description: "My description 1",
        title: "My fixture 1"
      },
      headers: {
        request: ["x-api-key"]
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

    api.request.setHeader("x-api-key", "zzz-www-ddd");
    api.request.setHeader("x-auth", "qawsedrftg");
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
                in: "header",
                name: "x-api-key",
                required: false,
                schema: {
                  example: "zzz-www-ddd",
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
