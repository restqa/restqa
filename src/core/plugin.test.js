const jestqa = new JestQA(__filename, true);
const {ChildProcess} = require("child_process");
const Config = require("../config");
const express = require("express");
const Global = require("./global");
const path = require('path')
const fs = require('fs')
const YAML = require('yaml')
const Request = require("@restqa/restqapi/src/restqapi/lib/api/request");
const Response = require("@restqa/restqapi/src/restqapi/lib/api/response");

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

    function setExecutor(
      killProcessFn,
      serverPort,
      timoutBeforeLaunchServer = 0
    ) {
      jest.mock("cross-spawn", () => {
        return () => {
          return {
            stderr: {
              on: jest.fn()
            },
            stdout: {
              on: (evt, fn) => {
                setTimeout(() => {
                  fn("output");
                }, 100);
              }
            },
            on: jest.fn()
          };
        };
      });
      const childProcess = Object.create(ChildProcess.prototype);
      childProcess.kill = killProcessFn;
      childProcess.pid = 9999;
      const Executor = require("./executor");
      const mockExecuteCommand = jest.spyOn(Executor.prototype, "execute");

      setTimeout(() => {
        servers.push(express().listen(serverPort));
      }, timoutBeforeLaunchServer);

      return mockExecuteCommand;
    }

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

    test("Run the command to run the server and kill the process", async () => {
      const PORT = 4049;
      const COMMAND = "npm start";
      const config = new Config();
      config.getLocalTest().setPort(PORT);
      config.getLocalTest().setCommand(COMMAND);

      // Executor
      const mockProcessKill = jest.fn();
      const mockExecuteCommand = setExecutor(mockProcessKill, PORT);

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
        config
      };
      Plugin(options, processor);

      // Execute Hooks
      const [beforeAll, afterAll] = Hooks;
      await beforeAll();
      afterAll();

      expect(mockExecuteCommand).toHaveBeenCalledWith();
      expect(mockProcessKill).not.toHaveBeenCalled();
    }, 10000);

    test("Run the command to run the server but with a short delay and kill the process", async () => {
      const PORT = 4040;
      const COMMAND = "npm start";
      const config = new Config();
      config.getLocalTest().setPort(PORT);
      config.getLocalTest().setCommand(COMMAND);

      // Executor
      const mockProcessKill = jest.fn();
      const mockExecuteCommand = setExecutor(mockProcessKill, PORT, 3000);

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
        config
      };
      Plugin(options, processor);

      // Execute Hooks
      const [beforeAll, afterAll] = Hooks;
      await beforeAll();
      afterAll();

      expect(mockExecuteCommand).toHaveBeenCalledWith();
      expect(mockProcessKill).not.toHaveBeenCalled();
    }, 10000);

    test("Do not run the command if an environement is passed (integration test)", async () => {
      const config = new Config();
      config.addIntegration("UAT", "http://test.com");

      // Executor
      const mockProcessKill = jest.fn();
      const mockExecuteCommand = setExecutor(mockProcessKill, 9090, 3000);

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

      expect(mockExecuteCommand).not.toHaveBeenCalled();
      expect(mockProcessKill).not.toHaveBeenCalled();
    });

    test("Throw error if the server is not started before the timeout", async () => {
      const PORT = 5058;
      const COMMAND = "npm start";
      const config = new Config();
      config.getLocalTest().setPort(PORT);
      config.getLocalTest().setCommand(COMMAND);

      // Executor
      const mockProcessKill = jest.fn();
      const mockExecuteCommand = setExecutor(mockProcessKill, PORT, 6000);

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
        config
      };
      Plugin(options, processor);

      // Execute Hooks
      const [beforeAll, afterAll] = Hooks;
      const $this = {
        restqa: {
          mock: {
            http: {
              GITHUB_API: "http://localhost:8066/github"
            }
          }
        }
      };

      await expect(beforeAll.call($this)).rejects.toThrow(
        new Error(
          "Couldn't reach the server running on the port 5058 (timeout 4000ms)"
        )
      );
      afterAll.call($this);
      expect(mockExecuteCommand).toHaveBeenCalledWith();
    }, 10000);
  });

  describe("performance", () => {
    test("init with performance config", async () => {
      const config = new Config();
      config.getPerformanceTest().setOutputFolder(path.resolve(jestqa.getTmpFolder(), "perf"));
      config.getPerformanceTest().setTool('artillery');
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
            })
          }
        ]
      };
      $this.apis[0].request.setMethod("POST");
      $this.apis[0].request.addFormField("type", "user");
      $this.apis[0].request.addFormField("firstName", "john");
      $this.apis[0].request.addFormField("lastName", "doe");

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

      const Hooks = []

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
        env: 'uat'
      };
      Plugin(options, processor);

      const [AfterAll] = Hooks

      const $$this = {
        restqa: {}
      }
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

      const tmpFiles = path.resolve(config.getPerformanceTest().getOutputFolder(), 'account.api.yml')
      expect(fs.existsSync(tmpFiles)).toBe(true);
      const generatedFile = fs.readFileSync(tmpFiles).toString("utf-8");
      expect(YAML.parse(generatedFile)).toEqual(expectedFile);
      expect($$this.restqa.performance).toEqual([ tmpFiles ])
    });
  });

  describe("specification", () => {
    test("init with specification config", async () => {
      const config = new Config();
      config.setName('My fixture 1')
      config.setDescription('My description 1')
      config.getSpecification().setTool('swagger');

      const $this = {
        api: {
          toJSON: () => require('./specification/tests/fixture-1/api-list.json')[0]
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
        },
      };

      const Hooks = []

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
        env: 'uat'
      };
      Plugin(options, processor);

      const [AfterAll] = Hooks

      const $$this = {
        restqa: {}
      }
      await AfterAll.call($$this);

      const specification = require('./specification/tests/fixture-1/expect.swagger.json')
      expect($$this.restqa.specification).toEqual(specification)
    });
  });
});
