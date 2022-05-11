const fs = require("fs");
const path = require("path");
const os = require("os");
const Request = require("@restqa/restqapi/src/restqapi/lib/api/request");
const Response = require("@restqa/restqapi/src/restqapi/lib/api/response");
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

describe("#lib - performance", () => {
  test("throw an error if the configuration doesn't contains the tool", () => {
    const Performance = require("./performance");
    expect(() => Performance({})).toThrow(
      'The performance property "tool" should be specify. (available: artillery)'
    );
  });

  describe("add scenario", () => {
    test("Do not add the scenario into if the apis is empty", () => {
      const config = {
        tool: "artillery",
        onlySuccess: true
      };
      const Performance = require("./performance")(config);

      expect(Performance.add([])).toBe(false);
      expect(Performance.features).toEqual({});
    });

    test("Do not add the scenario into if the result of the scenario is not passed", () => {
      const config = {
        tool: "artillery",
        onlySuccess: true
      };
      const Performance = require("./performance")(config);
      const api = {
        request: {},
        response: {}
      };

      const scenario = {
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
        },
        pickle: {
          line: 4,
          uri: "example/features/users.api.feature"
        }
      };
      expect(Performance.add([api], scenario)).toBe(false);
      expect(Performance.features).toEqual({});
    });

    test("add the scenario if the passed", () => {
      const config = {
        tool: "artillery"
      };
      const Performance = require("./performance")(config);
      const apis = [
        {request: Request("http://localhost", false, "xx-yyy-zzzz")}
      ];

      const scenario = {
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
        },
        pickle: {
          line: 4,
          uri: "example/features/users.api.feature"
        }
      };
      expect(Performance.add(apis, scenario)).toBe(true);
      const expectedScenarios = {
        "users.api.yml": [
          {
            apis,
            scenario
          }
        ]
      };
      expect(Performance.features).toEqual(expectedScenarios);
    });
  });

  describe("generate scenarios", () => {
    describe("artillery format", () => {
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
        const Performance = require("./performance")(config);
        Performance.add(apis, scenario);
        Performance.generate();
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
        const Performance = require("./performance")(config);
        Performance.add(apis, scenario);
        Performance.generate();
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
        const Performance = require("./performance")(config);
        Performance.add(apis, scenario);
        Performance.generate();
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
        const Performance = require("./performance")(config);
        Performance.add(apis, scenario);
        Performance.generate();
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
        const Performance = require("./performance")(config);
        Performance.add(apis, scenario);
        Performance.generate();
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

        expect(fs.existsSync(tmpFiles[0])).toBe(true);
        const generatedFile = fs.readFileSync(tmpFiles[0]).toString("utf-8");
        expect(YAML.parse(generatedFile)).toEqual(expectedFile);
      });
    });
  });
});
