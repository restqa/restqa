const fs = require("fs");
const path = require("path");
const os = require("os");
const Request = require("@restqa/plugin-rest-api/src/rest-api/lib/api/request");
const Response = require("@restqa/plugin-rest-api/src/rest-api/lib/api/response");
const YAML = require("yaml");

let tmpFiles = [];

beforeEach(() => {
  tmpFiles.forEach((file) => fs.existsSync(file) && fs.unlinkSync(file));
  tmpFiles = [];
});

afterEach(() => {
  jest.resetModules();
  tmpFiles.forEach((file) => fs.existsSync(file) && fs.unlinkSync(file));
  tmpFiles = [];
});

describe("#performance - artillery", () => {
  test("generate into specific file (method + url)", () => {
    const apis = [
      {
        request: Request("http://localhost", false, "xx-yyy-zzzz"),
        response: Response({
          statusCode: 200,
          headers: {
            "content-type": "application/json"
          }
        })
      }
    ];
    const scenario = {
      pickle: {
        uri: "example/features/users.api.feature",
        language: "en",
        locations: [
          {
            column: 1,
            line: 4
          }
        ],
        name: "Successfull creation (no data variable)",
        steps: [
          {
            arguments: [],
            locations: [
              {
                column: 7,
                line: 5
              }
            ],
            text: "I have the api gateway"
          }
        ]
      },
      result: {
        duration: 1001000000,
        exception: {
          actual: 201,
          code: "ERR_ASSERTION",
          expected: 200,
          generatedMessage: false,
          operator: "strictEqual"
        },
        status: "passed"
      }
    };

    const config = {
      tool: "artillery",
      outputFolder: path.resolve(os.tmpdir(), "perf"),
      onlySuccess: true
    };
    tmpFiles.push(path.join(config.outputFolder, "users.api.yml"));
    const Performance = require("../");
    const instance = new Performance(config);
    instance.add(apis, scenario);
    instance.generate();
    const expectedFile = {
      scenarios: [
        {
          name: "Successfull creation (no data variable)",
          flow: [
            {
              get: {
                url: "/",
                headers: {
                  "user-agent": "restqa (https://github.com/restqa/restqa)",
                  "x-correlation-id": "xx-yyy-zzzz"
                },
                expect: [{statusCode: 200}, {contentType: "json"}]
              }
            }
          ]
        }
      ]
    };

    expect(fs.existsSync(tmpFiles[0])).toBe(true);
    const generatedFile = fs.readFileSync(tmpFiles[0]).toString("utf-8");
    expect(YAML.parse(generatedFile)).toEqual(expectedFile);
  });

  test("generate into specific file (method + url) - no response content type", () => {
    const apis = [
      {
        request: Request("http://localhost", false, "xx-yyy-zzzz"),
        response: Response({
          statusCode: 204
        })
      }
    ];
    const scenario = {
      pickle: {
        uri: "example/features/users.api.feature",
        language: "en",
        locations: [
          {
            column: 1,
            line: 4
          }
        ],
        name: "Successfull creation (no data variable)",
        steps: [
          {
            arguments: [],
            locations: [
              {
                column: 7,
                line: 5
              }
            ],
            text: "I have the api gateway"
          }
        ]
      },
      result: {
        duration: 1001000000,
        exception: {
          actual: 204,
          code: "ERR_ASSERTION",
          expected: 204,
          generatedMessage: false,
          operator: "strictEqual"
        },
        status: "passed"
      }
    };

    const config = {
      tool: "artillery",
      outputFolder: path.resolve(os.tmpdir(), "perf"),
      onlySuccess: true
    };
    tmpFiles.push(path.join(config.outputFolder, "users.api.yml"));
    const Performance = require("../");
    const instance = new Performance(config);
    instance.add(apis, scenario);
    instance.generate();
    const expectedFile = {
      scenarios: [
        {
          name: "Successfull creation (no data variable)",
          flow: [
            {
              get: {
                url: "/",
                headers: {
                  "user-agent": "restqa (https://github.com/restqa/restqa)",
                  "x-correlation-id": "xx-yyy-zzzz"
                },
                expect: [{statusCode: 204}]
              }
            }
          ]
        }
      ]
    };

    expect(fs.existsSync(tmpFiles[0])).toBe(true);
    const generatedFile = fs.readFileSync(tmpFiles[0]).toString("utf-8");
    expect(YAML.parse(generatedFile)).toEqual(expectedFile);
  });

  test("generate into specific file (method + url + headers)", () => {
    const apis = [
      {
        request: Request("http://localhost", false, "xx-yyy-zzzz"),
        response: Response({
          statusCode: 404,
          headers: {
            "content-type": "text/html"
          }
        })
      }
    ];
    apis[0].request.setHeader("x-foo", "bar");
    apis[0].request.setHeader("cookie", undefined);
    const scenario = {
      pickle: {
        uri: "example/features/users.api.feature",
        language: "en",
        locations: [
          {
            column: 1,
            line: 4
          }
        ],
        name: "Successfull creation (no data variable)",
        steps: [
          {
            arguments: [],
            locations: [
              {
                column: 7,
                line: 5
              }
            ],
            text: "I have the api gateway"
          }
        ]
      },
      result: {
        duration: 1001000000,
        exception: {
          actual: 201,
          code: "ERR_ASSERTION",
          expected: 200,
          generatedMessage: false,
          operator: "strictEqual"
        },
        status: "passed"
      }
    };

    const config = {
      tool: "artillery",
      outputFolder: path.resolve(os.tmpdir(), "perf"),
      onlySuccess: true
    };
    tmpFiles.push(path.join(config.outputFolder, "users.api.yml"));
    const Performance = require("../");
    const instance = new Performance(config);
    instance.add(apis, scenario);
    instance.generate();
    const expectedFile = {
      scenarios: [
        {
          name: "Successfull creation (no data variable)",
          flow: [
            {
              get: {
                url: "/",
                headers: {
                  "x-foo": "bar",
                  "user-agent": "restqa (https://github.com/restqa/restqa)",
                  "x-correlation-id": "xx-yyy-zzzz"
                },
                expect: [{statusCode: 404}, {contentType: "html"}]
              }
            }
          ]
        }
      ]
    };

    expect(fs.existsSync(tmpFiles[0])).toBe(true);
    const generatedFile = fs.readFileSync(tmpFiles[0]).toString("utf-8");
    expect(YAML.parse(generatedFile)).toEqual(expectedFile);
  });

  test("generate into specific file (method + url + query string)", () => {
    const apis = [
      {
        request: Request("http://localhost", false, "xx-yyy-zzzz"),
        response: Response({
          statusCode: 200,
          headers: {
            "content-type": "application/json"
          }
        })
      }
    ];
    apis[0].request.setQueryString("filter", "title");
    const scenario = {
      pickle: {
        uri: "example/features/users.api.feature",
        language: "en",
        locations: [
          {
            column: 1,
            line: 4
          }
        ],
        name: "Successfull creation (no data variable)",
        steps: [
          {
            arguments: [],
            locations: [
              {
                column: 7,
                line: 5
              }
            ],
            text: "I have the api gateway"
          }
        ]
      },
      result: {
        duration: 1001000000,
        exception: {
          actual: 201,
          code: "ERR_ASSERTION",
          expected: 200,
          generatedMessage: false,
          operator: "strictEqual"
        },
        status: "passed"
      }
    };

    const config = {
      tool: "artillery",
      outputFolder: path.resolve(os.tmpdir(), "perf"),
      onlySuccess: true
    };
    tmpFiles.push(path.join(config.outputFolder, "users.api.yml"));
    const Performance = require("../");
    const instance = new Performance(config);
    instance.add(apis, scenario);
    instance.generate();
    const expectedFile = {
      scenarios: [
        {
          name: "Successfull creation (no data variable)",
          flow: [
            {
              get: {
                url: "/",
                headers: {
                  "user-agent": "restqa (https://github.com/restqa/restqa)",
                  "x-correlation-id": "xx-yyy-zzzz"
                },
                qs: {
                  filter: "title"
                },
                expect: [{statusCode: 200}, {contentType: "json"}]
              }
            }
          ]
        }
      ]
    };

    expect(fs.existsSync(tmpFiles[0])).toBe(true);
    const generatedFile = fs.readFileSync(tmpFiles[0]).toString("utf-8");
    expect(YAML.parse(generatedFile)).toEqual(expectedFile);
  });

  test("generate into specific file (method + url + json body), and the test failed however this config.onlySuccess is set to false", () => {
    const apis = [
      {
        request: Request("http://localhost", false, "xx-yyy-zzzz"),
        response: Response({
          statusCode: 200,
          headers: {
            "content-type": "application/json; charset=utf-8"
          }
        })
      }
    ];
    apis[0].request.addPayload("type", "user");
    apis[0].request.addPayload("person.firstName", "john");
    apis[0].request.addPayload("person.lastName", "doe");
    const scenario = {
      pickle: {
        uri: "example/features/users.api.feature",
        language: "en",
        locations: [
          {
            column: 1,
            line: 4
          }
        ],
        name: "Successfull creation (no data variable)",
        steps: [
          {
            arguments: [],
            locations: [
              {
                column: 7,
                line: 5
              }
            ],
            text: "I have the api gateway"
          }
        ]
      },
      result: {
        duration: 1001000000,
        exception: {
          actual: 201,
          code: "ERR_ASSERTION",
          expected: 200,
          generatedMessage: false,
          operator: "strictEqual"
        },
        status: "failed"
      }
    };

    const config = {
      tool: "artillery",
      outputFolder: path.resolve(os.tmpdir(), "perf"),
      onlySuccess: false
    };
    tmpFiles.push(path.join(config.outputFolder, "users.api.yml"));
    const Performance = require("../");
    const instance = new Performance(config);
    instance.add(apis, scenario);
    instance.generate();
    const expectedFile = {
      scenarios: [
        {
          name: "Successfull creation (no data variable)",
          flow: [
            {
              get: {
                url: "/",
                headers: {
                  "user-agent": "restqa (https://github.com/restqa/restqa)",
                  "x-correlation-id": "xx-yyy-zzzz"
                },
                json: {
                  type: "user",
                  person: {
                    firstName: "john",
                    lastName: "doe"
                  }
                },
                expect: [{statusCode: 200}, {contentType: "json"}]
              }
            }
          ]
        }
      ]
    };

    expect(fs.existsSync(tmpFiles[0])).toBe(true);
    const generatedFile = fs.readFileSync(tmpFiles[0]).toString("utf-8");
    expect(YAML.parse(generatedFile)).toEqual(expectedFile);
  });

  test("generate into specific file (method + url + form body)", () => {
    const apis = [
      {
        request: new Request("http://localhost", false, "xx-yyy-zzzz"),
        response: Response({
          statusCode: 200,
          headers: {
            "content-type": "application/json"
          }
        })
      },
      {
        request: new Request("http://localhost", false, "aa-bbb-ccc"),
        response: Response({
          statusCode: 404,
          headers: {
            "content-type": "text/html"
          }
        })
      }
    ];
    apis[0].request.setMethod("POST");
    apis[0].request.addFormField("type", "user");
    apis[0].request.addFormField("firstName", "john");
    apis[0].request.addFormField("lastName", "doe");

    const scenario = {
      pickle: {
        uri: "example/features/users.api.feature",
        language: "en",
        locations: [
          {
            column: 1,
            line: 4
          }
        ],
        name: "Successfull creation (no data variable)",
        steps: [
          {
            arguments: [],
            locations: [
              {
                column: 7,
                line: 5
              }
            ],
            text: "I have the api gateway"
          }
        ]
      },
      result: {
        duration: 1001000000,
        exception: {
          actual: 201,
          code: "ERR_ASSERTION",
          expected: 200,
          generatedMessage: false,
          operator: "strictEqual"
        },
        status: "passed"
      }
    };

    const config = {
      tool: "artillery",
      outputFolder: path.resolve(os.tmpdir(), "perf"),
      onlySuccess: true
    };
    tmpFiles.push(path.join(config.outputFolder, "users.api.yml"));
    const Performance = require("../");
    const instance = new Performance(config);
    instance.add(apis, scenario);
    const result = instance.generate();
    const expectedFile = {
      scenarios: [
        {
          name: "Successfull creation (no data variable)",
          flow: [
            {
              post: {
                url: "/",
                headers: {
                  "user-agent": "restqa (https://github.com/restqa/restqa)",
                  "x-correlation-id": "xx-yyy-zzzz"
                },
                formData: {
                  type: "user",
                  firstName: "john",
                  lastName: "doe"
                },
                expect: [{statusCode: 200}, {contentType: "json"}]
              }
            },
            {
              get: {
                url: "/",
                headers: {
                  "user-agent": "restqa (https://github.com/restqa/restqa)",
                  "x-correlation-id": "aa-bbb-ccc"
                },
                expect: [{statusCode: 404}, {contentType: "html"}]
              }
            }
          ]
        }
      ]
    };

    expect(result).toEqual(tmpFiles);
    expect(fs.existsSync(tmpFiles[0])).toBe(true);
    const generatedFile = fs.readFileSync(tmpFiles[0]).toString("utf-8");
    expect(YAML.parse(generatedFile)).toEqual(expectedFile);
  });
});
