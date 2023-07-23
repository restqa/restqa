const path = require("path");
const kill = require("tree-kill");
const {EventEmitter} = require("events");

// MOCK
let mockEvent;
const mockExit = jest.fn();
jest.mock("../src/utils/process", () => {
  return {
    on: (e, fn) => {
      mockEvent.on(e, fn);
    },
    exit: mockExit
  };
});

const MockLogger = {
  success: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
  info: jest.fn()
};
jest.mock("@restqa/core-logger", () => {
  return {
    Locale: jest.requireActual("@restqa/core-logger").Locale,
    Logger: MockLogger
  };
});

// Class
const Microservice = require("../src/index");

// Hooks
beforeEach(() => {
  mockEvent = new EventEmitter();
});

afterEach(() => {
  jest.resetModules();
});

// Test
describe("#Microservice - Test Commands", () => {
  const {Logger} = require("@restqa/core-logger");
  // Mocks and spies
  const loggerSuccessSpy = jest
    .spyOn(Logger, "success")
    .mockImplementation(jest.fn());

  test("given an valid command when we execute it then process.stdout.write should have been called (not a server)", async () => {
    // Given
    const optionsWithValidCommand = {
      command: "ls -l",
      state: {
        outputStream: {
          addDebugLog: jest.fn()
        }
      }
    };
    const Instance = new Microservice(optionsWithValidCommand);

    // When
    await Instance.start();

    // Then
    expect(loggerSuccessSpy).toHaveBeenCalledWith(
      `Server is running (command: ${optionsWithValidCommand.command})`
    );
  });

  test("given a mistyped command when we execute it then it should throw an error", async () => {
    // Given
    const optionsMistypedCommand = {
      command: ["ls", ["-l"]],
      state: {
        outputStream: {
          addDebugLog: jest.fn()
        }
      }
    };
    const Instance = new Microservice(optionsMistypedCommand);

    // When
    expect.assertions(1);
    try {
      await Instance.start();
    } catch (error) {
      // Then
      // eslint-disable-next-line
      expect(error).toEqual(
        new Error(
          `Microservice: command should be a string but received ${typeof optionsMistypedCommand.command}`
        )
      );
    }
  });

  test("given a command that should fail when we execute it then it should throw an error", async () => {
    // Given
    const optionsWithInvalidCommand = {
      command: "ls dsqsq",
      state: {
        outputStream: {
          addDebugLog: jest.fn()
        }
      }
    };
    const Instance = new Microservice(optionsWithInvalidCommand);

    // When
    expect.assertions(1);
    try {
      await Instance.start();
    } catch (error) {
      // Then
      // eslint-disable-next-line
      expect(error).toEqual(
        new Error(
          `Error during running command ${optionsWithInvalidCommand.command}`
        )
      );
    }
  });
});

describe("#Microservice - Server lifecycle", () => {
  let CURRENT_PID;

  beforeEach(() => {
    CURRENT_PID = null;
  });

  afterEach(() => {
    return new Promise((resolve) => {
      kill(CURRENT_PID, "SIGTERM", resolve);
    });
  });

  test("Run and shutdown microservice (not silent)", async () => {
    const serverFilename = path.resolve(__dirname, "fixture", "server.js");
    const addDebugLog = jest.fn();
    const options = {
      port: 9090,
      command: "node " + serverFilename,
      silent: false,
      timeout: 1000,
      state: {
        outputStream: {
          addDebugLog
        }
      }
    };
    const Instance = new Microservice(options);
    expect(Instance.isRunning).toBe(false);
    await Instance.start();
    CURRENT_PID = Instance.server.pid;
    expect(Instance.isRunning).toBe(true);
    await Instance.stop();
    expect(addDebugLog).toHaveBeenCalledWith(
      "Server running on the port 9090\n"
    );
    expect(Instance.server.killed).toBe(true);
  });

  test("Run silent service", async () => {
    const serverFilename = path.resolve(__dirname, "fixture", "server-silent.js");
    const options = {
      port: 9999,
      command: "node " + serverFilename,
      silent: false,
      timeout: 3000,
    };

    const Instance = new Microservice(options);
    expect(Instance.isRunning).toBe(false);
    await Instance.start();
    CURRENT_PID = Instance.server.pid;
    expect(Instance.isRunning).toBe(true);
    await Instance.stop();
    expect(Instance.server.killed).toBe(true);
  });

  test("Run and shutdown microservice (silent)", async () => {
    const serverFilename = path.resolve(__dirname, "fixture", "server.js");
    const addDebugLog = jest.fn();
    const options = {
      port: 9090,
      command: "node " + serverFilename,
      silent: true,
      timeout: 1000,
      state: {
        outputStream: {
          addDebugLog
        }
      }
    };
    const Instance = new Microservice(options);
    expect(Instance.isRunning).toBe(false);
    await Instance.start();
    CURRENT_PID = Instance.server.pid;
    expect(Instance.isRunning).toBe(true);
    await Instance.stop();
    expect(addDebugLog).not.toHaveBeenCalled();
  });

  test("Pass environement variable to the  microservice", async () => {
    const serverFilename = path.resolve(__dirname, "fixture", "server-envs.js");
    const addDebugLog = jest.fn();
    const options = {
      port: 9090,
      command: "node " + serverFilename,
      silent: false,
      timeout: 1000,
      envs: {
        TEST_FOO: "BAR",
        TEST_HELLO: "WORLD"
      },
      state: {
        outputStream: {
          addDebugLog
        }
      }
    };
    const Instance = new Microservice(options);
    expect(Instance.isRunning).toBe(false);
    await Instance.start();
    CURRENT_PID = Instance.server.pid;
    expect(Instance.isRunning).toBe(true);
    await Instance.stop();
    expect(addDebugLog).toHaveBeenCalledWith(
      "received the environemet variable TEST_FOO=BAR\n"
    );
    expect(addDebugLog).toHaveBeenCalledWith(
      "received the environemet variable TEST_HELLO=WORLD\n"
    );
    expect(Instance.server.killed).toBe(true);
  });

  test("Pass coverage path to the  microservice", async () => {
    const serverFilename = path.resolve(
      __dirname,
      "fixture",
      "server-coverage.js"
    );
    const addDebugLog = jest.fn();
    const options = {
      port: 9090,
      command: "node " + serverFilename,
      silent: false,
      timeout: 1000,
      envs: {
        TEST_FOO: "BAR",
        TEST_HELLO: "WORLD"
      },
      state: {
        outputStream: {
          addDebugLog
        }
      }
    };
    const Instance = new Microservice(options);
    Instance.coveragePath = "/tmp/test";
    expect(Instance.isRunning).toBe(false);
    await Instance.start();
    CURRENT_PID = Instance.server.pid;
    expect(Instance.isRunning).toBe(true);
    await Instance.stop();
    expect(addDebugLog).toHaveBeenCalledWith(
      `received the environemet variable NODE_V8_COVERAGE=/tmp/test\n`
    );
    expect(Instance.server.killed).toBe(true);
  });

  test("Get Error from timeout", async () => {
    const serverFilename = path.resolve(
      __dirname,
      "fixture",
      "server-timeout.js"
    );
    const addDebugLog = jest.fn();
    const options = {
      port: 9090,
      command: "node " + serverFilename,
      silent: false,
      timeout: 150,
      envs: {
        START_AFTER: 10000
      },
      state: {
        outputStream: {
          addDebugLog
        }
      }
    };
    const Instance = new Microservice(options);
    expect(Instance.isRunning).toBe(false);

    // When
    await expect(Instance.start()).rejects.toThrow(
      `Couldn't reach the server running on the port 9090 (timeout 150ms)`
    );
    CURRENT_PID = Instance.server.pid;
    expect(Instance.isRunning).toBe(false);
    await Instance.stop();
    expect(Instance.server.killed).toBe(true);
  });
});

describe("#Microservice - Process kill", () => {
  test("Kill microservice if receive SIGTERM signal", async () => {
    const serverFilename = path.resolve(__dirname, "fixture", "server.js");
    const addDebugLog = jest.fn();
    const options = {
      port: 9090,
      command: "node " + serverFilename,
      silent: false,
      state: {
        outputStream: {
          addDebugLog
        }
      }
    };
    const Instance = new Microservice(options);
    expect(Instance.isRunning).toBe(false);
    await Instance.start();
    expect(Instance.isRunning).toBe(true);
    mockEvent.emit("SIGTERM");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    expect(Instance.isRunning).toBe(false);
    expect(Instance.server.killed).toBe(true);
    expect(mockExit).toHaveBeenCalled();
  });

  test("Kill microservice if receive SIGINT signal", async () => {
    const serverFilename = path.resolve(__dirname, "fixture", "server.js");
    const addDebugLog = jest.fn();
    const options = {
      port: 9090,
      command: "node " + serverFilename,
      silent: false,
      state: {
        outputStream: {
          addDebugLog
        }
      }
    };
    const Instance = new Microservice(options);
    expect(Instance.isRunning).toBe(false);
    await Instance.start();
    expect(Instance.isRunning).toBe(true);
    mockEvent.emit("SIGINT");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    expect(Instance.isRunning).toBe(false);
    expect(Instance.server.killed).toBe(true);
    expect(mockExit).toHaveBeenCalled();
  });

  test("Kill microservice if receive SIGBREAK signal", async () => {
    const serverFilename = path.resolve(__dirname, "fixture", "server.js");
    const addDebugLog = jest.fn();
    const options = {
      port: 9090,
      command: "node " + serverFilename,
      silent: false,
      state: {
        outputStream: {
          addDebugLog
        }
      }
    };
    const Instance = new Microservice(options);
    expect(Instance.isRunning).toBe(false);
    await Instance.start();
    expect(Instance.isRunning).toBe(true);
    mockEvent.emit("SIGBREAK");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    expect(Instance.isRunning).toBe(false);
    expect(Instance.server.killed).toBe(true);
    expect(mockExit).toHaveBeenCalled();
  });

  test("Kill microservice if receive SIGHUP signal", async () => {
    const serverFilename = path.resolve(__dirname, "fixture", "server.js");
    const addDebugLog = jest.fn();
    const options = {
      port: 9090,
      command: "node " + serverFilename,
      silent: false,
      state: {
        outputStream: {
          addDebugLog
        }
      }
    };
    const Instance = new Microservice(options);
    expect(Instance.isRunning).toBe(false);
    await Instance.start();
    expect(Instance.isRunning).toBe(true);
    mockEvent.emit("SIGHUP");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    expect(Instance.isRunning).toBe(false);
    expect(Instance.server.killed).toBe(true);
    expect(mockExit).toHaveBeenCalled();
  });
});
