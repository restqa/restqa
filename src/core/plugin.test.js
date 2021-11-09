const jestqa = new JestQA(__filename, true);
const {ChildProcess} = require("child_process");
const Config = require("../config");
const express = require("express");

beforeEach(jestqa.beforeEach);
afterEach(jestqa.afterEach);

describe("#core - plugin", () => {
  describe("#core - plugin", () => {
    const servers = [];
    afterAll(() => {
      servers.forEach((server) => server.close());
    });

    function setExecutor(
      killProcessFn,
      serverPort,
      timoutBeforeLaunchServer = 0
    ) {
      const childProcess = Object.create(ChildProcess.prototype);
      childProcess.kill = killProcessFn;
      childProcess.pid = 9999;
      const executor = require("./executor");
      const mockExecuteCommand = jest
        .spyOn(executor, "execute")
        .mockResolvedValue(childProcess);

      setTimeout(() => {
        servers.push(express().listen(serverPort));
      }, timoutBeforeLaunchServer);

      return mockExecuteCommand;
    }

    function setTreeKillMock(mockTreeKill) {
      jest.mock("treekill", () => {
        return mockTreeKill;
      });
      return mockTreeKill;
    }

    test("Throw error error if RestQA config is not container", () => {
      const Plugin = require("./plugin");
      expect(() => {
        Plugin("npm start");
      }).toThrow(
        new Error(
          "Please provide a processor containing the methods:  BeforeAll, AfterAll"
        )
      );
    });

    test("Throw error if the url is not found on the restqapi config", async () => {
      const PORT = 5056;
      const configFileWithoutUrl = `
---

version: 0.0.1
metadata:
  code: API
  name: My test API
  description: The decription of the test api
environments:
  - name: local
    default: true
    plugins:
      - name: "@restqa/restqapi"
        config:
          foo: bar
      - name: "@restqa/http-mock-plugin"
        config:
          debug: false
          port: 8888
          envs:
            GITHUB_API: github
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
    `;
      const configFile = jestqa.createTmpFile(
        configFileWithoutUrl,
        ".restqa.yml"
      );

      // Executor
      const mockProcessKill = jest.fn();
      setExecutor(mockProcessKill, PORT, 6000);

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
        command: "npm start",
        config: new Config({env: "local", configFile})
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
          "Please share the target url of your service on @restqa/restqapi plugin section"
        )
      );
      afterAll();
    }, 10000);

    test("Throw error if the restqapi plugin is not found", async () => {
      const PORT = 5055;
      const configFileWithoutRestQAPI = `
---

version: 0.0.1
metadata:
  code: API
  name: My test API
  description: The decription of the test api
environments:
  - name: local
    default: true
    plugins:
      - name: "@restqa/http-mock-plugin"
        config:
          debug: false
          port: 8888
          envs:
            GITHUB_API: github
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
    `;
      const configFile = jestqa.createTmpFile(
        configFileWithoutRestQAPI,
        ".restqa.yml"
      );

      // Executor
      const mockProcessKill = jest.fn();
      setExecutor(mockProcessKill, PORT, 6000);

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
        command: "npm start",
        config: new Config({env: "local", configFile})
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
          'Please enable the @restqa/restqapi plugin on the "environements" section of your .restqa.yml'
        )
      );
      afterAll();
    }, 10000);

    test("Run the command to run the server and kill the process", async () => {
      const PORT = 4049;
      const validRestQAConfigFile = `
---

version: 0.0.1
metadata:
  code: API
  name: My test API
  description: The decription of the test api
environments:
  - name: local
    default: true
    plugins:
      - name: "@restqa/restqapi"
        config:
          url: http://localhost:${PORT}
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
    `;
      const configFile = jestqa.createTmpFile(
        validRestQAConfigFile,
        ".restqa.yml"
      );

      const mockTreeKill = setTreeKillMock(jest.fn());

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
        command: "npm start",
        config: new Config({env: "local", configFile})
      };
      Plugin(options, processor);

      // Execute Hooks
      const [beforeAll, afterAll] = Hooks;
      await beforeAll();
      afterAll();

      expect(mockExecuteCommand).toHaveBeenCalledWith("npm start", undefined);
      expect(mockProcessKill).not.toHaveBeenCalled();
      expect(mockTreeKill).toHaveBeenCalled();
      expect(mockTreeKill).toHaveBeenCalledWith(9999);
    }, 10000);

    test("Run the command to run the server and kill the process (use 80 port if not defined on the url) // This test might fail if you can't use the port 80 locally...", async () => {
      if (process.env.CI) return; // if you want to ignore this test run the command: CI=true npm test
      const validRestQAConfigFile = `
---

version: 0.0.1
metadata:
  code: API
  name: My test API
  description: The decription of the test api
environments:
  - name: local
    default: true
    plugins:
      - name: "@restqa/restqapi"
        config:
          url: http://localhost
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
    `;
      const configFile = jestqa.createTmpFile(
        validRestQAConfigFile,
        ".restqa.yml"
      );

      const mockTreeKill = setTreeKillMock(jest.fn());

      // Executor
      const mockProcessKill = jest.fn();
      const mockExecuteCommand = setExecutor(mockProcessKill, 80);

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
        command: "npm start",
        config: new Config({env: "local", configFile})
      };
      Plugin(options, processor);

      // Execute Hooks
      const [beforeAll, afterAll] = Hooks;
      await beforeAll();
      afterAll();

      expect(mockExecuteCommand).toHaveBeenCalledWith("npm start", undefined);
      expect(mockProcessKill).not.toHaveBeenCalled();
      expect(mockTreeKill).toHaveBeenCalled();
      expect(mockTreeKill).toHaveBeenCalledWith(9999);
    }, 10000);

    test("Run the command to run the server but with a short delay and kill the process", async () => {
      const PORT = 5059;
      const validRestQAConfigFile = `
---

version: 0.0.1
metadata:
  code: API
  name: My test API
  description: The decription of the test api
environments:
  - name: local
    default: true
    plugins:
      - name: "@restqa/restqapi"
        config:
          url: http://localhost:${PORT}
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
    `;
      const configFile = jestqa.createTmpFile(
        validRestQAConfigFile,
        ".restqa.yml"
      );

      const mockTreeKill = setTreeKillMock(jest.fn());

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
        command: "npm start",
        config: new Config({env: "local", configFile})
      };
      Plugin(options, processor);

      // Execute Hooks
      const [beforeAll, afterAll] = Hooks;
      await beforeAll();
      afterAll();

      expect(mockExecuteCommand).toHaveBeenCalledWith("npm start", undefined);
      expect(mockProcessKill).not.toHaveBeenCalled();
      expect(mockTreeKill).toHaveBeenCalled();
      expect(mockTreeKill).toHaveBeenCalledWith(9999);
    }, 10000);

    test("Throw error if the server is not started before the timeout", async () => {
      const PORT = 5058;
      const validRestQAConfigFile = `
---

version: 0.0.1
metadata:
  code: API
  name: My test API
  description: The decription of the test api
environments:
  - name: local
    default: true
    plugins:
      - name: "@restqa/restqapi"
        config:
          url: http://localhost:${PORT}
      - name: "@restqa/http-mock-plugin"
        config:
          debug: false
          port: 8888
          envs:
            GITHUB_API: github
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
    `;
      const configFile = jestqa.createTmpFile(
        validRestQAConfigFile,
        ".restqa.yml"
      );

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
        command: "npm start",
        config: new Config({env: "local", configFile})
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
      afterAll();
      const expectedEnvs = {
        GITHUB_API: "http://localhost:8066/github"
      };
      expect(mockExecuteCommand).toHaveBeenCalledWith(
        "npm start",
        expectedEnvs
      );
    }, 10000);
  });
});
