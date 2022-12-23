const jestqa = new JestQA(__filename, true);
const Config = require("../config");
const Global = require("./global");
const path = require("path");
const fs = require("fs");
const YAML = require("yaml");
const Request = require("@restqa/plugin-rest-api/src/rest-api/lib/api/request");
const Response = require("@restqa/plugin-rest-api/src/rest-api/lib/api/response");

beforeEach(jestqa.beforeEach);
afterEach(jestqa.afterEach);

describe("#core - plugin", () => {
  describe("#core - plugin", () => {
    const servers = [];
    afterAll(() => {
      servers.forEach((server) => server.close());
    });

    beforeEach(() => {
      global.restqa = new Global();
    });

    afterEach(() => {
      delete global.restqa;
    });

    test("Throw error error if RestQA config is not accepted", () => {
      const Plugin = require("./plugin");
      expect(() => {
        Plugin({});
      }).toThrow(
        new Error(
          "Please provide a processor containing the methods:  BeforeAll, AfterAll"
        )
      );
    });

    test("Do not run the command if an environement is passed (integration test)", async () => {
      const config = new Config();
      config.addIntegration("UAT", "http://test.com");

      const Hooks = [];

      const processor = {
        Before: jest.fn(function () {
          this.data = {
            parse: jest.fn().mockResolvedValue()
          };
          const fn = arguments[1] || arguments[0];
          fn.call(this);
        }),
        After: jest.fn(function (fn) {
          fn.call(this);
        }),
        BeforeAll: function (fn) {
          Hooks.push(fn);
        },
        AfterAll: function (fn) {
          Hooks.push(fn);
        }
      };

      const Plugin = require("./plugin");
      const options = {
        env: "UAT",
        config
      };
      Plugin(options, processor);

      // Execute Hooks
      const [beforeAll, afterAll] = Hooks;
      beforeAll && (await beforeAll());
      afterAll && afterAll();
      expect(true).toBe(true);
    });
  });

  describe("performance", () => {
    test("init with performance config", async () => {
      const config = new Config();
      config.setName("test-unit");
      config
        .getPerformanceTest()
        .setOutputFolder(path.resolve(jestqa.getTmpFolder(), "perf"));
      config.getPerformanceTest().setTool("artillery");
      config.getPerformanceTest().setOnlySuccess(true);

      const $this = {
        apis: [
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
            }),
            toJSON: function () {
              return {
                response: this.response,
                request: this.request
              };
            }
          }
        ]
      };
      $this.apis[0].request.setMethod("POST");
      $this.apis[0].request.addFormField("type", "user");
      $this.apis[0].request.addFormField("firstName", "john");
      $this.apis[0].request.addFormField("lastName", "doe");
      $this.api = $this.apis[1];

      const scenario = {
        gherkinDocument: {
          feature: {
            name: "GET /"
          }
        },
        pickle: {
          uri: "example/features/account.api.feature",
          language: "en",
          locations: [
            {
              column: 1,
              line: 4
            }
          ],
          tags: [
            {
              name: "@performance"
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

      const Hooks = [];

      const processor = {
        Before: jest.fn(function () {
          this.data = {
            parse: jest.fn().mockResolvedValue()
          };
          const fn = arguments[1] || arguments[0];
          fn.call(this, scenario);
        }),
        After: jest.fn(function () {
          const fn = arguments[1] || arguments[0];
          fn.call($this, scenario);
        }),
        BeforeAll: function (fn) {
          Hooks.push(fn);
        },
        AfterAll: function (fn) {
          Hooks.push(fn);
        }
      };

      const Plugin = require("./plugin");
      const options = {
        config,
        report: true,
        env: "uat"
      };
      Plugin(options, processor);

      const [AfterAll] = Hooks;

      const $$this = {
        restqa: {}
      };
      await AfterAll.call($$this);

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

      const tmpFiles = path.resolve(
        config.getPerformanceTest().getOutputFolder(),
        "account.api.yml"
      );
      expect(fs.existsSync(tmpFiles)).toBe(true);
      const generatedFile = fs.readFileSync(tmpFiles).toString("utf-8");
      expect(YAML.parse(generatedFile)).toEqual(expectedFile);
      expect($$this.restqa.performance).toEqual([tmpFiles]);
    });
  });

  describe.skip("specification", () => {
    test("init with specification config", async () => {
      const config = new Config();
      config.setName("My fixture 1");
      config.setDescription("My description 1");
      config.getSpecification().setTool("swagger");

      const $this = {
        api: {
          toJSON: () =>
            require("./specification/tests/fixture-1/api-list.json")[0]
        }
      };

      const scenario = {
        pickle: {
          uri: "example/features/account.api.feature",
          language: "en",
          locations: [
            {
              column: 1,
              line: 4
            }
          ],
          name: "Successfull hello world",
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
        }
      };

      const Hooks = [];

      const processor = {
        Before: jest.fn(function () {
          this.data = {
            parse: jest.fn().mockResolvedValue()
          };
          const fn = arguments[1] || arguments[0];
          fn.call(this, scenario);
        }),
        After: jest.fn(function () {
          const fn = arguments[1] || arguments[0];
          fn.call($this, scenario);
        }),
        BeforeAll: function (fn) {
          Hooks.push(fn);
        },
        AfterAll: function (fn) {
          Hooks.push(fn);
        }
      };

      const Plugin = require("./plugin");
      const options = {
        config,
        report: true,
        env: "uat"
      };
      Plugin(options, processor);

      const [AfterAll] = Hooks;

      const $$this = {
        restqa: {}
      };
      await AfterAll.call($$this);

      const specification = require("./specification/tests/fixture-1/expect.swagger.json");
      expect($$this.restqa.specification).toEqual(specification);
    });
  });
});
