beforeEach(() => {
  jest.resetModules();
});

describe("#Channel - File", () => {
  const path = require("path");

  test("Rejected if the config doesn't contain the path", () => {
    const File = require("./file");
    const config = {};
    const result = {};
    return expect(File(config, result)).rejects.toThrow(
      new Error('config.path is required for the "file" report')
    );
  });

  test("Rejected if the writting is failing", async () => {
    const fs = require("fs");
    jest.mock("fs");
    fs.writeFile = jest.fn((filename, output, format, cb) => {
      cb(new Error("foo is not working"));
    });

    const File = require("./file");
    const config = {
      path: "test.json"
    };
    const result = {};
    await expect(File(config, result)).rejects.toThrow(
      new Error("[FILE REPORT][ERROR] - test.json : foo is not working")
    );
    expect(fs.writeFile.mock.calls).toHaveLength(1);
    expect(fs.writeFile.mock.calls[0][0]).toEqual(path.resolve("test.json"));
    expect(fs.writeFile.mock.calls[0][1]).toEqual("{}");
    expect(fs.writeFile.mock.calls[0][2]).toEqual("utf8");
  });

  test("Success Case", () => {
    const fs = require("fs");
    jest.mock("fs");
    fs.writeFile = jest.fn((filename, output, format, cb) => {
      cb();
    });

    const File = require("./file");
    const config = {
      path: "test.json"
    };
    const result = {};
    return expect(File(config, result)).resolves.toEqual(
      `[FILE REPORT][SUCCESS] - ${path.resolve("test.json")}`
    );
  });
});
