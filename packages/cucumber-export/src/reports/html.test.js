const os = require("os");
const fs = require("fs-extra");
const path = require("path");

const FOLDER = path.resolve(os.tmpdir(), "report");

beforeEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
  if (fs.existsSync(FOLDER)) {
    fs.remove(FOLDER);
  }
});

describe("#Channel - html", () => {
  test("Copy files from html-report/dist and add the result files", async () => {
    process.env.CI = true;
    const Html = require("./html");

    const config = {
      folder: FOLDER
    };
    const result = {
      foo: "bar"
    };

    const expectedMessage = `[HTML REPORT][SUCCESS] - Your report has been generated at file://${FOLDER}/index.html`;
    await expect(Html(config, result)).resolves.toEqual(expectedMessage);

    expect(fs.existsSync(FOLDER)).toBe(true);
    const fileResult = path.resolve(FOLDER, "restqa.result.js");
    expect(fs.existsSync(fileResult)).toBe(true);
    const expectedFileResult = `window.OUTPUT = {
  "RESTQA_RESULT": {
    "foo": "bar"
  }
}`;

    expect(fs.readFileSync(fileResult).toString("utf-8").trim()).toEqual(
      expectedFileResult.trim()
    );
  });

  test("Throw error if got any issue", () => {
    const Html = require("./html");
    const config = {
      folder: () => {}
    };
    const result = {
      foo: "bar"
    };

    const expectedMessage = `[HTML REPORT][ERROR] - () => {} : The "path" argument must be of type string or an instance of Buffer or URL. Received function folder`;
    return expect(Html(config, result)).rejects.toEqual(
      new Error(expectedMessage)
    );
  });
});
