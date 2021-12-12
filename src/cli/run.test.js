const path = require("path");
const os = require("os");

const jestqa = new JestQA(__filename, true);

jest.useFakeTimers();

beforeEach(jestqa.beforeEach);
afterEach(jestqa.afterEach);

const validRestQAConfigFile = `
---

version: 0.0.1
metadata:
  code: API
  name: My test API
  description: The decription of the test api
environments:
  - name: local
    default: true
    plugins:
      - name: restqapi
        config:
          url: http://host.docker.internal:4046
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

  test("Run the cucumber success tests with passed stdout", async () => {
    const content = `
---

version: 0.0.1
metadata:
  code: API
  name: My test API
  description: The decription of the test api
environments:
  - name: local
    default: true
    plugins:
      - name: restqapi
        config:
          url: http://host.docker.internal:4046
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
    `;
    const filename = jestqa.createTmpFile(content, ".restqa.yml");

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

    const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {});

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
        "../src/setup.js",
        "--format",
        "../src/restqa-formatter:.restqa.log",
        "--format-options",
        '{"snippetSyntax": "../src/restqa-snippet.js"}',
        path.resolve(".", "{*.feature,!(node_modules)", "**", "*.feature}"),
        os.tmpdir()
      ],
      cwd: path.join(__dirname, "../"),
      stdout: "std-out-example"
    };
    expect(mockCucumberCli.mock.calls[0][0]).toEqual(expectedRunOption);
    expect(mockCucumberRun.mock.calls).toHaveLength(1);
    expect(mockExit).toHaveBeenCalledWith(0);
  });

  test("Run the cucumber success tests with passed stdout, with the args passed as commander", async () => {
    const content = `
---

version: 0.0.1
metadata:
  code: API
  name: My test API
  description: The decription of the test api
environments:
  - name: local
    default: true
    plugins:
      - name: restqapi
        config:
          url: http://host.docker.internal:4046
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
    `;
    const filename = jestqa.createTmpFile(content, ".restqa.yml");

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

    const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {});

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
        "../src/setup.js",
        "--format",
        "../src/restqa-formatter:.restqa.log",
        "--format-options",
        '{"snippetSyntax": "../src/restqa-snippet.js"}',
        path.resolve(".", "{*.feature,!(node_modules)", "**", "*.feature}"),
        os.tmpdir()
      ],
      cwd: path.join(__dirname, "../"),
      stdout: "std-out-example"
    };
    expect(mockCucumberCli.mock.calls[0][0]).toEqual(expectedRunOption);
    expect(mockCucumberRun.mock.calls).toHaveLength(1);
    expect(mockExit).toHaveBeenCalledWith(0);
  });

  test("Run the cucumber failing tests with default stdout", async () => {
    const content = `
---

version: 0.0.1
metadata:
  code: API
  name: My test API
  description: The decription of the test api
environments:
  - name: local
    default: true
    plugins:
      - name: restqapi
        config:
          url: http://host.docker.internal:4046
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
    `;
    const filename = jestqa.createTmpFile(content, ".restqa.yml");

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

    const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {});

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
        "../src/setup.js",
        "--format",
        "../src/restqa-formatter:.restqa.log",
        "--format-options",
        '{"snippetSyntax": "../src/restqa-snippet.js"}',
        path.dirname(filename)
      ],
      cwd: path.join(__dirname, "../"),
      stdout: process.stdout
    };
    expect(mockCucumberCli.mock.calls[0][0]).toEqual(expectedRunOption);
    expect(mockCucumberRun.mock.calls).toHaveLength(1);
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  test("Run the cucumber test but should not exit", async () => {
    const content = `
---

version: 0.0.1
metadata:
  code: API
  name: My test API
  description: The decription of the test api
environments:
  - name: local
    default: true
    plugins:
      - name: restqapi
        config:
          url: http://host.docker.internal:4046
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
    `;
    const filename = jestqa.createTmpFile(content, ".restqa.yml");

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

    const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {});

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
        "../src/setup.js",
        "--format",
        "../src/restqa-formatter:.restqa.log",
        "--format-options",
        '{"snippetSyntax": "../src/restqa-snippet.js"}',
        path.resolve(".", "{*.feature,!(node_modules)", "**", "*.feature}")
      ],
      cwd: path.join(__dirname, "../"),
      stdout: process.stdout
    };
    expect(mockCucumberCli.mock.calls[0][0]).toEqual(expectedRunOption);
    expect(mockCucumberRun.mock.calls).toHaveLength(1);
    expect(mockExit).not.toHaveBeenCalled();
  });

  test("Run the cucumber test with expected tag", async () => {
    const content = `
---

version: 0.0.1
metadata:
  code: API
  name: My test API
  description: The decription of the test api
environments:
  - name: local
    default: true
    plugins:
      - name: restqapi
        config:
          url: http://host.docker.internal:4046
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
    `;
    const filename = jestqa.createTmpFile(content, ".restqa.yml");

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

    const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {});

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
        "../src/setup.js",
        "--format",
        "../src/restqa-formatter:.restqa.log",
        "--format-options",
        '{"snippetSyntax": "../src/restqa-snippet.js"}',
        "--tags",
        "@production",
        "--tags",
        "@success",
        path.resolve(".", "{*.feature,!(node_modules)", "**", "*.feature}")
      ],
      cwd: path.join(__dirname, "../"),
      stdout: process.stdout
    };
    expect(mockCucumberCli.mock.calls[0][0]).toEqual(expectedRunOption);
    expect(mockCucumberRun.mock.calls).toHaveLength(1);
    expect(mockExit).not.toHaveBeenCalled();
  });

  test("Error during cucumber run execution", async () => {
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

    const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {});

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
        "../src/setup.js",
        "--format",
        "../src/restqa-formatter:.restqa.log",
        "--format-options",
        '{"snippetSyntax": "../src/restqa-snippet.js"}',
        path.resolve(".", "{*.feature,!(node_modules)", "**", "*.feature}")
      ],
      cwd: path.join(__dirname, "../"),
      stdout: process.stdout
    };
    expect(mockCucumberCli.mock.calls[0][0]).toEqual(expectedRunOption);
    expect(mockCucumberRun.mock.calls).toHaveLength(1);
    expect(mockExit).toHaveBeenCalledWith(1);
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
    jest.mock("../../bin/program", () => {
      return {
        program: {
          parseAsync: jest.fn().mockResolvedValue(true)
        }
      };
    });
    const {program} = require("../../bin/program");

    // Given
    const Run = require("./run");

    // When
    await Run({});

    // Then
    expect(program.parseAsync).toHaveBeenCalled();
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
    return expect(Run({ skipInit: true, config })).rejects.toThrow(
      `The configuration file "${config}" doesn't exist.`
    );
  });
});
