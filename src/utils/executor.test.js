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
      // eslint-disable-next-line
      expect(error).toEqual(new Error(`Executor: command should be a string but received ${typeof mistypedCommand}`));
    }
  });
});