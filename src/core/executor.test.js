const {execute} = require("./executor");

jest.useFakeTimers("legacy");

describe("# utils - executor", () => {
  // Mocks and spies
  const loggerSuccessSpy = jest
    .spyOn(require("../utils/logger"), "success")
    .mockImplementation(jest.fn());

  const loggerInfoSpy = jest
    .spyOn(require("../utils/logger"), "info")
    .mockImplementation(jest.fn());

  const loggerWarningSpy = jest
    .spyOn(require("../utils/logger"), "warning")
    .mockImplementation(jest.fn());

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("given an valid command when we execute it then process.stdout.write should have been called", async () => {
    // Given
    const validCommand = "ls -l";

    // When
    await execute(validCommand);

    // Then
    expect(loggerSuccessSpy).toHaveBeenCalledWith(
      `Server is running (command: ${validCommand})`
    );
  });

  test("given a valid command when execute it then it should display a success message", async () => {
    // Given
    const validCommand = "ls -l";

    // When
    await execute(validCommand);

    // Then
    expect(loggerSuccessSpy).toHaveBeenCalledWith(
      `Server is running (command: ${validCommand})`
    );
  });

  test("given a mistyped command when we execute it then it should throw an error", async () => {
    // Given
    const mistypedCommand = ["ls", ["-l"]];

    // When
    expect.assertions(1);
    try {
      await execute(mistypedCommand);
    } catch (error) {
      // Then
      // eslint-disable-next-line
      expect(error).toEqual(
        new Error(
          `Executor: command should be a string but received ${typeof mistypedCommand}`
        )
      );
    }
  });

  test("given a command that should fail when we execute it then it should throw an error", async () => {
    // Given
    const commandShouldFail = "cd dsqsq";

    // When
    expect.assertions(1);
    try {
      await execute(commandShouldFail);
    } catch (error) {
      // Then
      // eslint-disable-next-line
      expect(error).toEqual(
        new Error(`Error during running command ${commandShouldFail}`)
      );
    }
  });

  test("given a silent set to false it should log each stdout data", async () => {
    // Given
    const validCommand = "ls -l";
    const envs = {};
    const options = {silent: false};

    // When
    await execute(validCommand, envs, options);

    // Then
    const firstCharactersFromLsCommand = "total";
    expect(loggerInfoSpy).toHaveBeenCalledWith(
      expect.stringContaining(`[DEBUG]: ${firstCharactersFromLsCommand}`)
    );
  });

  test("given a silent set to true it should display a warning message", async () => {
    // Given
    const validCommand = "ls -l";
    const envs = {};
    const options = {silent: true};

    // When
    await execute(validCommand, envs, options);

    // Then
    expect(loggerWarningSpy).toHaveBeenCalledWith(
      expect.stringContaining("Silent mode enabled")
    );
  });
});
