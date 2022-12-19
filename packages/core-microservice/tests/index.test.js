const Microservice = require("../src/index");

jest.useFakeTimers("legacy");

afterEach(() => {
  jest.resetModules();
});

describe("#Microservice", () => {
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
      command: "cd dsqsq",
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
