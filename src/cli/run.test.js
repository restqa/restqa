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
  test("Throw error if the passed file doesnt exist", async () => {
    const filename = path.resolve(os.tmpdir(), ".restqa.fake.yml");

    const options = {
      config: filename,
      stream: "std-out-example"
    };
    const Run = require("./run");
    return expect(Run(options)).rejects.toThrow(
      `The configuration file "${filename}" doesn't exist.`
    );
  });

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

  test("Run the cucumber test but shouldnt exit", async () => {
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

  describe("-x / -exec option", () => {
    // Mocks
    function setCucumberMock(jestFn) {
      jest.spyOn(require("@cucumber/cucumber"), "Cli")
        .mockImplementation(() => {
          return {
            run: jestFn
          };
        });
    }

    test("given a -x option when we run restqa then it should execute command before running cucumber", async() => {
      // Mocks
      const mockCucumberRun = jest.fn().mockResolvedValue({
        shouldExitImmediately: false,
        success: false
      });
      setCucumberMock(mockCucumberRun)
      const mockExecuteCommand = jest.spyOn(require("../utils/executor"), "execute");
      jest.spyOn(require("../utils/check-server"), "checkServer").mockImplementation(jest.fn());
      
      // Given
      const configFileName = jestqa.createTmpFile(validRestQAConfigFile, ".restqa.yml");
      const runOptionsWithCommand = {
        config: configFileName,
        exec: "echo lol"
      };
      const Run = require("./run");
      
      // When
      await Run(runOptionsWithCommand);
  
      // Then
      const mockExecuteCommandOrder = mockExecuteCommand.mock.invocationCallOrder[0]
      const mockCucumberRunOrder = mockCucumberRun.mock.invocationCallOrder[0]
      expect(mockExecuteCommandOrder).toBeLessThan(mockCucumberRunOrder)
      expect(mockExecuteCommand).toHaveBeenCalledWith(runOptionsWithCommand.exec, expect.objectContaining(new AbortController()));
    });

    test("given no -x option when we run restqa nothing should be executed", async() => {
        // Mocks
        const mockCucumberRun = jest.fn().mockResolvedValue({
          shouldExitImmediately: false,
          success: false
        });
        setCucumberMock(mockCucumberRun)
        const mockExecuteCommand = jest.spyOn(require("../utils/executor"), "execute");
        
        // Given
        const configFileName = jestqa.createTmpFile(validRestQAConfigFile, ".restqa.yml");
        const runOptionsWithoutCommand = {
          config: configFileName,
          exec: undefined
        };
        const Run = require("./run");
        
        // When
        await Run(runOptionsWithoutCommand);
    
        // Then
        expect(mockExecuteCommand).not.toHaveBeenCalled();
        expect(mockCucumberRun).toHaveBeenCalled();
    });

    test("given a -x option when we run restqa and execution failed then it should exit", async() => {
      // Mocks
      const mockCucumberRun = jest.fn().mockResolvedValue({
        shouldExitImmediately: false,
        success: false
      });
      setCucumberMock(mockCucumberRun)
      const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {});
      const mockExecuteCommand = jest.spyOn(require("../utils/executor"), "execute")
        .mockRejectedValue(new Error("boom"));
      
      // Given
      const configFileName = jestqa.createTmpFile(validRestQAConfigFile, ".restqa.yml");
      const runOptionsWithCommand = {
        config: configFileName,
        exec: "echo lol"
      };
      const Run = require("./run");
      
      // When
      await Run(runOptionsWithCommand);
  
      // Then
      expect(mockExecuteCommand).toHaveBeenCalledWith(runOptionsWithCommand.exec, expect.objectContaining(new AbortController()));
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    test("given a -x option when we run restqa and execution failed then it use AbortController.abort", async() => {
      // Mocks
      const mockCucumberRun = jest.fn().mockRejectedValue(new Error("Boom"));
      setCucumberMock(mockCucumberRun);
      const spyAbort = jest.spyOn(AbortController.prototype, "abort");
      jest.spyOn(require("../utils/executor"), "execute");
      jest.spyOn(require("../utils/check-server"), "checkServer").mockImplementation(jest.fn());

      // Given
      const configFileName = jestqa.createTmpFile(validRestQAConfigFile, ".restqa.yml");
      const runOptionsWithCommand = {
        config: configFileName,
        exec: "echo lol"
      };

      // When
      const Run = require("./run");
      await Run(runOptionsWithCommand);
      jest.advanceTimersByTime(5000);

      // Then
      expect(spyAbort).toHaveBeenCalled();
    });
  });

});
