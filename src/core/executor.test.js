const Executor = require("./executor");

jest.useFakeTimers("legacy");

const jestqa = new JestQA(__filename, true);

beforeEach(jestqa.beforeEach);
afterEach(jestqa.afterEach);

describe("# utils - executor", () => {
  const Logger = require("../utils/logger");
  // Mocks and spies
  const loggerSuccessSpy = jest
    .spyOn(Logger, "success")
    .mockImplementation(jest.fn());

  /*
  const loggerInfoSpy = jest
    .spyOn(Logger, "info")
    .mockImplementation(jest.fn());
  */

  test("given an valid command when we execute it then process.stdout.write should have been called (not a server)", async () => {
    // Given
    const optionsWithValidCommand = {
      command: "ls -l"
    };
    const Instance = new Executor(optionsWithValidCommand);

    // When
    await Instance.execute();

    // Then
    expect(loggerSuccessSpy).toHaveBeenCalledWith(
      `Server is running (command: ${optionsWithValidCommand.command})`
    );
  });

  test("given a mistyped command when we execute it then it should throw an error", async () => {
    // Given
    const optionsMistypedCommand = {
      command: ["ls", ["-l"]]
    };
    const Instance = new Executor(optionsMistypedCommand);

    // When
    expect.assertions(1);
    try {
      await Instance.execute();
    } catch (error) {
      // Then
      // eslint-disable-next-line
      expect(error).toEqual(
        new Error(
          `Executor: command should be a string but received ${typeof optionsMistypedCommand.command}`
        )
      );
    }
  });

  test("given a command that should fail when we execute it then it should throw an error", async () => {
    // Given
    const optionsWithInvalidCommand = {
      command: "cd dsqsq"
    };
    const Instance = new Executor(optionsWithInvalidCommand);

    // When
    expect.assertions(1);
    try {
      await Instance.execute();
    } catch (error) {
      // Then
      // eslint-disable-next-line
      expect(error).toEqual(
        new Error(`Error during running command ${optionsWithInvalidCommand.command}`)
      );
    }
  });
});
