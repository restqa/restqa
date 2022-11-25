const os = require("os");
const fs = require("fs-extra");
const path = require("path");

const FOLDER = path.resolve(os.tmpdir(), "report");
const HTML_TEMPLATE_FOLDER = path.resolve(
  __dirname,
  "..",
  "..",
  "html-report-template",
  "dist"
);

beforeEach(() => {
  jest.resetModules();
  if (fs.existsSync(FOLDER)) {
    fs.remove(FOLDER);
  }
});

describe.skip("#Channel - html", () => {
  test("Copy files from html-report/dist and add the result files", async () => {
    const mockOpen = jest.fn();
    jest.mock("open", () => {
      return mockOpen;
    });
    const Html = require("./html");

    const config = {
      folder: FOLDER
    };
    const result = {
      foo: "bar"
    };

    const expectedMessage = `[HTML REPORT][SUCCESS] - Your report has been generated at file://${FOLDER}/index.html`;
    await expect(Html(config, result)).resolves.toEqual(expectedMessage);

    fs.readdirSync(HTML_TEMPLATE_FOLDER).forEach((item) => {
      const expectedFilename = fs.existsSync(path.resolve(FOLDER, item));
      if (!expectedFilename) {
        throw new Error(`The file ${item} hasn't been copied into ${FOLDER}`);
      }
    });

    expect(fs.existsSync(FOLDER)).toBe(true);
    const fileResult = path.resolve(FOLDER, "restqa-result.js");
    expect(fs.existsSync(fileResult)).toBe(true);
    const expectedFileResult = `
window.RESTQA_RESULT = {
  "foo": "bar"
}`;
    expect(fs.readFileSync(fileResult).toString("utf-8")).toEqual(
      expectedFileResult.trim()
    );
    expect(fs.readFileSync(fileResult).toString("utf-8")).toEqual(
      expectedFileResult.trim()
    );
    expect(mockOpen).toHaveBeenCalledWith(`file://${FOLDER}/index.html`);
  });

  test("Copy files from html-report/dist and add the result files but do not open in the browser", async () => {
    const mockOpen = jest.fn();
    jest.mock("open", () => {
      return mockOpen;
    });
    const Html = require("./html");

    const config = {
      folder: FOLDER,
      browserOpening: false
    };
    const result = {
      foo: "bar"
    };

    const expectedMessage = `[HTML REPORT][SUCCESS] - Your report has been generated at file://${FOLDER}/index.html`;
    await expect(Html(config, result)).resolves.toEqual(expectedMessage);

    fs.readdirSync(HTML_TEMPLATE_FOLDER).forEach((item) => {
      const expectedFilename = fs.existsSync(path.resolve(FOLDER, item));
      if (!expectedFilename) {
        throw new Error(`The file ${item} hasn't been copied into ${FOLDER}`);
      }
    });

    expect(fs.existsSync(FOLDER)).toBe(true);
    const fileResult = path.resolve(FOLDER, "restqa-result.js");
    expect(fs.existsSync(fileResult)).toBe(true);
    const expectedFileResult = `
window.RESTQA_RESULT = {
  "foo": "bar"
}`;
    expect(fs.readFileSync(fileResult).toString("utf-8")).toEqual(
      expectedFileResult.trim()
    );
    expect(fs.readFileSync(fileResult).toString("utf-8")).toEqual(
      expectedFileResult.trim()
    );
    expect(mockOpen).not.toHaveBeenCalled();
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
