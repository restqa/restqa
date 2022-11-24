const fs = require("fs");
const path = require("path");

const jestqa = new JestQA(__filename, true);

beforeEach(jestqa.beforeEach);
afterEach(jestqa.afterEach);

describe("coverage", () => {
  test("Get the tmp dir", () => {
    const Coverage = require("./index");
    const options = {
      "restqa-report": jestqa.getTmpFolder(),
      tmp: jestqa.getTmpFolder()
    };
    const coverage = new Coverage(options);

    const tmpPath = path.resolve(options.tmp, "restqa-cov");
    expect(coverage.tmp).toEqual(tmpPath);
    expect(fs.existsSync(tmpPath)).toEqual(true);
  });

  test("Get report dir", () => {
    const Coverage = require("./index");
    const options = {
      "restqa-report": jestqa.getTmpFolder(),
      tmp: jestqa.getTmpFolder()
    };
    const reportPath = path.resolve(options["restqa-report"], "coverage");
    const coverage = new Coverage(options);
    expect(coverage.report).toEqual(reportPath);
  });

  test("Get filename", () => {
    const Coverage = require("./index");
    const options = {
      "restqa-report": jestqa.getTmpFolder(),
      tmp: jestqa.getTmpFolder()
    };
    const filename = path.resolve(
      options["restqa-report"],
      "coverage",
      "index.html"
    );
    const coverage = new Coverage(options);
    expect(coverage.filename).toEqual(filename);
  });

  test("set filename", () => {
    const Coverage = require("./index");
    const options = {
      "restqa-report": jestqa.getTmpFolder(),
      tmp: jestqa.getTmpFolder(),
      filename: "test/index.html"
    };
    const filename = path.resolve(process.cwd(), options.filename);
    const coverage = new Coverage(options);
    expect(coverage.filename).toEqual(filename);
  });

  test("generate Report", async () => {
    const mockReportRun = jest.fn();
    const mockReport = jest.fn().mockReturnValue({
      run: mockReportRun
    });

    jest.mock("c8", () => {
      return {
        Report: mockReport
      };
    });

    const Coverage = require("./index");

    const options = {
      "restqa-report": jestqa.getTmpFolder(),
      tmp: jestqa.getTmpFolder()
    };
    const coverage = new Coverage(options);
    await coverage.generate();

    const expectedOption = {
      reporter: ["html", "text", "json-summary"],
      tempDirectory: path.resolve(options.tmp, "restqa-cov"),
      reportsDirectory: path.resolve(options["restqa-report"], "coverage")
    };

    expect(mockReport.mock.calls[0][0]).toEqual(expectedOption);
    expect(mockReportRun).toHaveBeenCalled();

    const filename = path.resolve(
      options["restqa-report"],
      "coverage",
      "index.html"
    );
    expect(coverage.filename).toEqual(filename);
  });

  test("Use custom report", async () => {
    const mockReport = jest.fn();

    jest.mock("c8", () => {
      return {
        Report: mockReport
      };
    });

    const Coverage = require("./index");

    const options = {
      "restqa-report": jestqa.getTmpFolder(),
      tmp: jestqa.getTmpFolder(),
      filename: "test/index.html"
    };

    const coverage = new Coverage(options);
    await coverage.generate();

    expect(mockReport).not.toHaveBeenCalled();

    const filename = path.resolve(process.cwd(), options.filename);
    expect(coverage.filename).toEqual(filename);
  });
});
