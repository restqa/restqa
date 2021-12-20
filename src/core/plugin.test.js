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
      jest.mock("cross-spawn", () => {
        return () => {
          return {
            stderr: {
              on: jest.fn()
            },
            stdout: {
              on: (evt, fn) => {
                setTimeout(fn, 100);
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
      config.getUnitTest().setPort(PORT);
      config.getUnitTest().setCommand(COMMAND);

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
      config.getUnitTest().setPort(PORT);
      config.getUnitTest().setCommand(COMMAND);

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
      config.getUnitTest().setPort(PORT);
      config.getUnitTest().setCommand(COMMAND);

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
});
