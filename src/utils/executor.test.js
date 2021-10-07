const {execute} = require("./executor");

describe("# utils - executor", () => {
  const stdoutSpy = jest.spyOn(process.stdout, "write")

  test("given an valid command when we execute it then process.stdout.write should have been called", async() => {
    // Given
    const validCommand = "ls -l";

    // When
    await execute(validCommand);

    // Then
    expect(stdoutSpy).toHaveBeenCalled();
  });

  test("given a mistyped command when we execute it then it should throw an error", async() => {
    // Given
    const mistypedCommand = ["ls", ["-l"]];

    // When
    expect.assertions(1);
    try {
      await execute(mistypedCommand)
    } catch(error) {
      // Then
      // eslint-disable-next-line
      expect(error).toEqual(new Error(`Executor: command should be a string but received ${typeof mistypedCommand}`));
    }
  });

  test("given a valid command when execute it then it should display a success message", async () => {
    // Mocks and spies
    const loggerSpy = jest.spyOn(require("../utils/logger"), "success");

    // Given
    const validCommand = "ls -l";

    // When
    await execute(validCommand);

    // Then
    expect(loggerSpy).toHaveBeenCalledWith(`Server is running ${validCommand}`);
  });

  test("given a command that should fail when we execute it then it should throw an error", async() => {
    // Given
    const commandShouldFail = "ls dd-sdd";

    // When
    expect.assertions(2);
    try {
      await execute(commandShouldFail)
    } catch(error) {
      // Then
      // eslint-disable-next-line
      expect(error).toEqual(new Error(`Command exited, code: 1`));
      // eslint-disable-next-line
      expect(stdoutSpy).toHaveBeenCalled();
    }
  });
});