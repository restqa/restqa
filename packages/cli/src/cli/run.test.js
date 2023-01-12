const path = require("path");
const os = require("os");

const jestqa = new JestQA(__filename, true);

jest.useFakeTimers();

beforeEach(jestqa.beforeEach);
afterEach(jestqa.afterEach);

let mockExit;
beforeEach(() => {
  mockExit = jest.fn();
  jest.mock("../utils/process", () => {
    return {
      exit: mockExit
    };
  });
});

const validRestQAConfigFile = `
---

version: 0.0.1
metadata:
  code: API
  name: My test API
  description: The decription of the test api
tests:
  local:
    command: npm run dev
    port: 8080 
  integrations:
  - name: UAT
    url: https://example.com
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
    `;

describe("#Cli - Run", () => {
  test("Throw error if tag is not starting with a @", async () => {
    const filename = path.resolve(os.tmpdir(), ".restqa.fake.yml");
    const options = {
      config: filename,
      stream: "std-out-example",
      tags: ["production", "@success"]
    };
    const Run = require("./run");
    return expect(Run(options)).rejects.toThrow(
      'The tags should start with the symbol "@" (example: @production)'
    );
  });

  test("Run the cucumber success local tests with passed stdout", async () => {
    const filename = jestqa.createTmpFile(validRestQAConfigFile, ".restqa.yml");

    const mockCucumberRun = jest.fn().mockResolvedValue({
      shouldExitImmediately: true,
      success: true
    });

    const mockCucumberCli = jest.fn().mockImplementation(() => {
      return {
        run: mockCucumberRun
      };
    });

    jest.mock("@cucumber/cucumber", () => {
      return {
        Cli: mockCucumberCli
      };
    });

    const Run = require("./run");
    const options = {
      config: filename,
      stream: "std-out-example",
      args: [".", os.tmpdir()]
    };
    await Run(options);
    expect(mockCucumberCli.mock.calls).toHaveLength(1);
    const expectedRunOption = {
      argv: [
        "node",
        "cucumber-js",
        "--require",
        "./src/setup.js",
        "--format-options",
        '{"snippetSyntax": "./src/restqa-snippet.js"}',
        "--format",
        "./src/formatters/local-test-formatter",
        path.resolve(
          ".",
          "{*.feature,!(node_modules|restqa)",
          "**",
          "*.feature}"
        ),
        os.tmpdir()
      ],
      cwd: path.join(__dirname, "../"),
      stdout: "std-out-example"
    };
    expect(mockCucumberCli.mock.calls[0][0]).toEqual(expectedRunOption);
    expect(mockCucumberRun.mock.calls).toHaveLength(1);
    expect(mockExit.mock.calls[0][0]).toEqual(0);
  });

  test("Run the cucumber success local tests with passed stdout, with the args passed as commander", async () => {
    const filename = jestqa.createTmpFile(validRestQAConfigFile, ".restqa.yml");

    const mockCucumberRun = jest.fn().mockResolvedValue({
      shouldExitImmediately: true,
      success: true
    });

    const mockCucumberCli = jest.fn().mockImplementation(() => {
      return {
        run: mockCucumberRun
      };
    });

    jest.mock("@cucumber/cucumber", () => {
      return {
        Cli: mockCucumberCli
      };
    });

    const Run = require("./run");
    const options = {
      config: filename,
      stream: "std-out-example"
    };

    const program = {
      args: [".", os.tmpdir()]
    };

    await Run(options, program);
    expect(mockCucumberCli.mock.calls).toHaveLength(1);
    const expectedRunOption = {
      argv: [
        "node",
        "cucumber-js",
        "--require",
        "./src/setup.js",
        "--format-options",
        '{"snippetSyntax": "./src/restqa-snippet.js"}',
        "--format",
        "./src/formatters/local-test-formatter",
        path.resolve(
          ".",
          "{*.feature,!(node_modules|restqa)",
          "**",
          "*.feature}"
        ),
        os.tmpdir()
      ],
      cwd: path.join(__dirname, "../"),
      stdout: "std-out-example"
    };
    expect(mockCucumberCli.mock.calls[0][0]).toEqual(expectedRunOption);
    expect(mockCucumberRun.mock.calls).toHaveLength(1);
    expect(mockExit.mock.calls[0][0]).toEqual(0);
  });

  test("Run the cucumber failing local tests with default stdout", async () => {
    const filename = jestqa.createTmpFile(validRestQAConfigFile, ".restqa.yml");

    const mockCucumberRun = jest.fn().mockResolvedValue({
      shouldExitImmediately: true,
      success: false
    });

    const mockCucumberCli = jest.fn().mockImplementation(() => {
      return {
        run: mockCucumberRun
      };
    });

    jest.mock("@cucumber/cucumber", () => {
      return {
        Cli: mockCucumberCli
      };
    });

    const Run = require("./run");
    const options = {
      args: [path.dirname(filename)]
    };
    await Run(options);
    expect(mockCucumberCli.mock.calls).toHaveLength(1);
    const expectedRunOption = {
      argv: [
        "node",
        "cucumber-js",
        "--require",
        "./src/setup.js",
        "--format-options",
        '{"snippetSyntax": "./src/restqa-snippet.js"}',
        "--format",
        "./src/formatters/local-test-formatter",
        path.dirname(filename)
      ],
      cwd: path.join(__dirname, "../"),
      stdout: process.stdout
    };
    expect(mockCucumberCli.mock.calls[0][0]).toEqual(expectedRunOption);
    expect(mockCucumberRun.mock.calls).toHaveLength(1);
    expect(mockExit.mock.calls[0][0]).toEqual(1);
  });

  test("Run the cucumber local test but should not exit", async () => {
    const filename = jestqa.createTmpFile(validRestQAConfigFile, ".restqa.yml");

    const mockCucumberRun = jest.fn().mockResolvedValue({
      shouldExitImmediately: false,
      success: false
    });

    const mockCucumberCli = jest.fn().mockImplementation(() => {
      return {
        run: mockCucumberRun
      };
    });

    jest.mock("@cucumber/cucumber", () => {
      return {
        Cli: mockCucumberCli
      };
    });

    const Run = require("./run");
    const options = {
      config: filename
    };
    await Run(options);
    expect(mockCucumberCli.mock.calls).toHaveLength(1);
    const expectedRunOption = {
      argv: [
        "node",
        "cucumber-js",
        "--require",
        "./src/setup.js",
        "--format-options",
        '{"snippetSyntax": "./src/restqa-snippet.js"}',
        "--format",
        "./src/formatters/local-test-formatter",
        path.resolve(
          ".",
          "{*.feature,!(node_modules|restqa)",
          "**",
          "*.feature}"
        )
      ],
      cwd: path.join(__dirname, "../"),
      stdout: process.stdout
    };
    expect(mockCucumberCli.mock.calls[0][0]).toEqual(expectedRunOption);
    expect(mockCucumberRun.mock.calls).toHaveLength(1);
  });

  test("Run the cucumber local test with expected tag", async () => {
    const filename = jestqa.createTmpFile(validRestQAConfigFile, ".restqa.yml");

    const mockCucumberRun = jest.fn().mockResolvedValue({
      shouldExitImmediately: false,
      success: false
    });

    const mockCucumberCli = jest.fn().mockImplementation(() => {
      return {
        run: mockCucumberRun
      };
    });

    jest.mock("@cucumber/cucumber", () => {
      return {
        Cli: mockCucumberCli
      };
    });

    const Run = require("./run");
    const options = {
      config: filename,
      tags: ["@production", "@success"]
    };
    await Run(options);
    expect(mockCucumberCli.mock.calls).toHaveLength(1);
    const expectedRunOption = {
      argv: [
        "node",
        "cucumber-js",
        "--require",
        "./src/setup.js",
        "--format-options",
        '{"snippetSyntax": "./src/restqa-snippet.js"}',
        "--format",
        "./src/formatters/local-test-formatter",
        "--tags",
        "@production",
        "--tags",
        "@success",
        path.resolve(
          ".",
          "{*.feature,!(node_modules|restqa)",
          "**",
          "*.feature}"
        )
      ],
      cwd: path.join(__dirname, "../"),
      stdout: process.stdout
    };
    expect(mockCucumberCli.mock.calls[0][0]).toEqual(expectedRunOption);
    expect(mockCucumberRun.mock.calls).toHaveLength(1);
  });

  test("Error during cucumber run execution local test", async () => {
    const filename = jestqa.createTmpFile(validRestQAConfigFile, ".restqa.yml");

    const mockCucumberRun = jest
      .fn()
      .mockRejectedValue(new Error("This is an error"));

    const mockCucumberCli = jest.fn().mockImplementation(() => {
      return {
        run: mockCucumberRun
      };
    });

    jest.mock("@cucumber/cucumber", () => {
      return {
        Cli: mockCucumberCli
      };
    });

    const Run = require("./run");
    const options = {
      config: filename
    };
    await Run(options);
    expect(mockCucumberCli.mock.calls).toHaveLength(1);
    const expectedRunOption = {
      argv: [
        "node",
        "cucumber-js",
        "--require",
        "./src/setup.js",
        "--format-options",
        '{"snippetSyntax": "./src/restqa-snippet.js"}',
        "--format",
        "./src/formatters/local-test-formatter",
        path.resolve(
          ".",
          "{*.feature,!(node_modules|restqa)",
          "**",
          "*.feature}"
        )
      ],
      cwd: path.join(__dirname, "../"),
      stdout: process.stdout
    };
    expect(mockCucumberCli.mock.calls[0][0]).toEqual(expectedRunOption);
    expect(mockCucumberRun.mock.calls).toHaveLength(1);
    expect(process.exitCode).toEqual(1);
    expect(jestqa.getLoggerMock()).toHaveBeenCalledTimes(1);
    expect(jestqa.getLoggerMock().mock.calls[0][0]).toMatch("This is an error");
  });

  test("it should call initialize if no .restqa.yml exist", async () => {
    // Mocks
    const mockCucumberCli = jest.fn().mockImplementation(() => {
      return {
        run: jest.fn().mockResolvedValue(true)
      };
    });
    jest.mock("@cucumber/cucumber", () => {
      return {
        Cli: mockCucumberCli
      };
    });
    jest.mock("../core/initialize", () => {
      return jest.fn().mockResolvedValue(true);
    });
    const Initialize = require("../core/initialize");

    // Given
    const Run = require("./run");

    // When
    await Run({});

    // Then
    expect(Initialize).toHaveBeenCalled();
  });

  test("it should throw an error if no .restqa.yml exist an option skipInit is enabled", async () => {
    // Mocks
    const mockCucumberCli = jest.fn().mockImplementation(() => {
      return {
        run: jest.fn().mockResolvedValue(true)
      };
    });
    jest.mock("@cucumber/cucumber", () => {
      return {
        Cli: mockCucumberCli
      };
    });
    jest.mock("../../bin/program", () => {
      return {
        program: {
          parseAsync: jest.fn().mockResolvedValue(true)
        }
      };
    });

    // Given
    const config = ".lol.yml";
    const Run = require("./run");

    // When, Then
    return expect(Run({skipInit: true, config})).rejects.toThrow(
      `The configuration file "${config}" doesn't exist.`
    );
  });

  test("Run the cucumber success local tests with passed report that add the export formatter", async () => {
    const filename = jestqa.createTmpFile(validRestQAConfigFile, ".restqa.yml");

    const mockCucumberRun = jest.fn().mockResolvedValue({
      shouldExitImmediately: true,
      success: true
    });

    const mockCucumberCli = jest.fn().mockImplementation(() => {
      return {
        run: mockCucumberRun
      };
    });

    jest.mock("@cucumber/cucumber", () => {
      return {
        Cli: mockCucumberCli
      };
    });

    const Run = require("./run");
    const options = {
      config: filename,
      stream: "std-out-example",
      args: [".", os.tmpdir()],
      report: true
    };
    await Run(options);
    expect(mockCucumberCli.mock.calls).toHaveLength(1);
    const expectedRunOption = {
      argv: [
        "node",
        "cucumber-js",
        "--require",
        "./src/setup.js",
        "--format-options",
        '{"snippetSyntax": "./src/restqa-snippet.js"}',
        "--format",
        "./src/formatters/export-formatter:.restqa.log",
        "--format",
        "./src/formatters/local-test-formatter",
        path.resolve(
          ".",
          "{*.feature,!(node_modules|restqa)",
          "**",
          "*.feature}"
        ),
        os.tmpdir()
      ],
      cwd: path.join(__dirname, "../"),
      stdout: "std-out-example"
    };
    expect(mockCucumberCli.mock.calls[0][0]).toEqual(expectedRunOption);
    expect(mockCucumberRun.mock.calls).toHaveLength(1);
    expect(mockExit.mock.calls[0][0]).toEqual(0);
  });

  test("Run the cucumber success integration tests with passed stdout that remove the local test formatter", async () => {
    const filename = jestqa.createTmpFile(validRestQAConfigFile, ".restqa.yml");

    const mockCucumberRun = jest.fn().mockResolvedValue({
      shouldExitImmediately: true,
      success: true
    });

    const mockCucumberCli = jest.fn().mockImplementation(() => {
      return {
        run: mockCucumberRun
      };
    });

    jest.mock("@cucumber/cucumber", () => {
      return {
        Cli: mockCucumberCli
      };
    });

    const Run = require("./run");
    const options = {
      config: filename,
      stream: "std-out-example",
      args: [".", os.tmpdir()],
      env: "UAT"
    };
    await Run(options);
    expect(mockCucumberCli.mock.calls).toHaveLength(1);
    const expectedRunOption = {
      argv: [
        "node",
        "cucumber-js",
        "--require",
        "./src/setup.js",
        "--format-options",
        '{"snippetSyntax": "./src/restqa-snippet.js"}',
        "--format",
        "./src/formatters/export-formatter:.restqa.log",
        path.resolve(
          ".",
          "{*.feature,!(node_modules|restqa)",
          "**",
          "*.feature}"
        ),
        os.tmpdir()
      ],
      cwd: path.join(__dirname, "../"),
      stdout: "std-out-example"
    };
    expect(mockCucumberCli.mock.calls[0][0]).toEqual(expectedRunOption);
    expect(mockCucumberRun.mock.calls).toHaveLength(1);
    expect(mockExit.mock.calls[0][0]).toEqual(0);
  });
});
