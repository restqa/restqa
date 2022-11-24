const Plugin = require("@restqa/plugin");
const chalk = require("chalk");

const jestqa = new JestQA(__filename, true);

beforeEach(jestqa.beforeEach);
afterEach(jestqa.afterEach);

jestqa.hooks.beforeEach = () => {
  delete process.env.RESTQA_CONFIG;
};

describe("#Cli - Steps", () => {
  test("Throw an error if the keyword is not passed", () => {
    const Steps = require("./steps");
    expect(() => {
      Steps();
    }).toThrow("Provide a keyword. Available: given | when | then");
  });

  test("Throw an error if the keyword is not valid", () => {
    const Steps = require("./steps");
    expect(() => {
      Steps("scenario");
    }).toThrow(
      '"scenario" is not a valid argument. Available: given | when | then'
    );
  });

  test("Throw an error if the output is not valid", () => {
    const Steps = require("./steps");
    expect(() => {
      Steps("Given", {output: "foobar"});
    }).toThrow(
      '"foobar" is not a valid output. Available: short | medium | large'
    );
  });

  test("Load the steps", () => {
    const content = `
---

version: 0.0.1
metadata:
  code: API
  name: My test API
  description: The decription of the test api
tests:
  local:
    port: 8080
    command: npm run dev
  integrations:
  - name: local
    url: http://uat.example.com
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
    `;
    const filename = jestqa.createTmpFile(content, ".restqa.yml");

    const mockPlugin = new Plugin("rest-api-plugin");
    mockPlugin
      .addGivenStep("my definition {string}", () => {}, "my comment")
      .addGivenStep(
        "ma definition {int} and {string}",
        () => {},
        "mon commentaire"
      );
    jest.mock("@restqa/rest-api-plugin", () => mockPlugin);

    const mockAddRow = jest.fn();
    const mockPrintTable = jest.fn();
    const mockTable = jest.fn(() => {
      return {
        addRow: mockAddRow,
        printTable: mockPrintTable
      };
    });

    jest.mock("console-table-printer", () => {
      return {
        Table: mockTable
      };
    });

    const Steps = require("./steps");
    const result = Steps("Given", {config: filename});

    expect(mockTable.mock.calls).toHaveLength(1);
    expect(mockTable.mock.calls[0][0].columns[0].name).toEqual("Plugin");
    expect(mockTable.mock.calls[0][0].columns[1].name).toEqual("Keyword");
    expect(mockTable.mock.calls[0][0].columns[2].name).toEqual("Step");
    expect(mockTable.mock.calls[0][0].columns[3].name).toEqual("Comment");

    expect(mockAddRow.mock.calls).toHaveLength(2);
    expect(mockAddRow.mock.calls[0][0]).toEqual({
      Plugin: "rest-api-plugin",
      Keyword: "given",
      Step: `my definition ${chalk.yellow("{string}")}`,
      Comment: "my comment"
    });

    expect(mockAddRow.mock.calls[1][0]).toEqual({
      Plugin: "rest-api-plugin",
      Keyword: "given",
      Step: `ma definition ${chalk.yellow("{int}")} and ${chalk.yellow(
        "{string}"
      )}`,
      Comment: "mon commentaire"
    });
    expect(mockPrintTable.mock.calls).toHaveLength(1);
    expect(result).toEqual([
      {
        Plugin: "rest-api-plugin",
        Keyword: "given",
        Step: `my definition ${chalk.yellow("{string}")}`,
        Comment: "my comment"
      },
      {
        Plugin: "rest-api-plugin",
        Keyword: "given",
        Step: `ma definition ${chalk.yellow("{int}")} and ${chalk.yellow(
          "{string}"
        )}`,
        Comment: "mon commentaire"
      }
    ]);
  });

  test("Load the steps from multiple plugin", () => {
    const content = `
---

version: 0.0.1
metadata:
  code: API
  name: My test API
  description: The decription of the test api
tests:
  local:
    port: 8089
    command: npm run dev
plugins:
  - name: '@restqa/restqmocki'
    `;
    const filename = jestqa.createTmpFile(content, ".restqa.yml");

    const mockPluginAPI = new Plugin("rest-api-plugin");
    mockPluginAPI
      .addThenStep("my definition", () => {}, "my comment")
      .addThenStep("ma definition", () => {}, "mon commentaire");
    jest.mock("@restqa/rest-api-plugin", () => mockPluginAPI);

    const mockPluginMocki = new Plugin("restqmocki");
    mockPluginMocki.addThenStep(
      "ma definition de mock",
      () => {},
      "mon commentaire de mock"
    );
    jest.mock("@restqa/restqmocki", () => mockPluginMocki, {virtual: true});

    jest.mock("../config/schema", () => {
      const originalModule = jest.requireActual("../config/schema");

      return {
        validate: originalModule.validate,
        pluginList: ["rest-api-plugin", "restqmock"]
      };
    });

    const mockAddRow = jest.fn();
    const mockPrintTable = jest.fn();
    const mockTable = jest.fn(() => {
      return {
        addRow: mockAddRow,
        printTable: mockPrintTable
      };
    });

    jest.mock("console-table-printer", () => {
      return {
        Table: mockTable
      };
    });

    const Steps = require("./steps");
    const result = Steps("Then", {config: filename});

    expect(mockTable.mock.calls).toHaveLength(1);
    expect(mockTable.mock.calls[0][0].columns[0].name).toEqual("Plugin");
    expect(mockTable.mock.calls[0][0].columns[1].name).toEqual("Keyword");
    expect(mockTable.mock.calls[0][0].columns[2].name).toEqual("Step");
    expect(mockTable.mock.calls[0][0].columns[3].name).toEqual("Comment");

    expect(mockAddRow.mock.calls).toHaveLength(3);
    expect(mockAddRow.mock.calls[0][0]).toEqual({
      Plugin: "rest-api-plugin",
      Keyword: "then",
      Step: "my definition",
      Comment: "my comment"
    });

    expect(mockAddRow.mock.calls[1][0]).toEqual({
      Plugin: "rest-api-plugin",
      Keyword: "then",
      Step: "ma definition",
      Comment: "mon commentaire"
    });

    expect(mockAddRow.mock.calls[2][0]).toEqual({
      Plugin: "restqmocki",
      Keyword: "then",
      Step: "ma definition de mock",
      Comment: "mon commentaire de mock"
    });
    expect(mockPrintTable.mock.calls).toHaveLength(1);
    expect(result).toEqual([
      {
        Plugin: "rest-api-plugin",
        Keyword: "then",
        Step: "my definition",
        Comment: "my comment"
      },
      {
        Plugin: "rest-api-plugin",
        Keyword: "then",
        Step: "ma definition",
        Comment: "mon commentaire"
      },
      {
        Plugin: "restqmocki",
        Keyword: "then",
        Step: "ma definition de mock",
        Comment: "mon commentaire de mock"
      }
    ]);
  });

  test("Load the steps search tags and no print", () => {
    const content = `
---

version: 0.0.1
metadata:
  code: API
  name: My test API
  description: The decription of the test api
tests:
  local:
    port: 8089
    command: npm run dev
    `;
    const filename = jestqa.createTmpFile(content, ".restqa.yml");

    const mockPluginAPI = new Plugin("rest-api-plugin");
    mockPluginAPI
      .addGivenStep("my definition", () => {}, "my comment", "header")
      .addGivenStep("my definitions", () => {}, "my comments", "headers")
      .addGivenStep("ma definition", () => {}, "mon commentaire", "api");
    jest.mock("@restqa/rest-api-plugin", () => mockPluginAPI);

    const mockAddRow = jest.fn();
    const mockPrintTable = jest.fn();
    const mockTable = jest.fn(() => {
      return {
        addRow: mockAddRow,
        printTable: mockPrintTable
      };
    });

    jest.mock("console-table-printer", () => {
      return {
        Table: mockTable
      };
    });

    const Steps = require("./steps");
    const result = Steps("Given", {
      config: filename,
      tag: "header",
      print: false
    });

    expect(mockTable.mock.calls).toHaveLength(1);
    expect(mockTable.mock.calls[0][0].columns[0].name).toEqual("Plugin");
    expect(mockTable.mock.calls[0][0].columns[1].name).toEqual("Keyword");
    expect(mockTable.mock.calls[0][0].columns[2].name).toEqual("Step");
    expect(mockTable.mock.calls[0][0].columns[3].name).toEqual("Comment");

    expect(mockAddRow.mock.calls).toHaveLength(2);
    expect(mockAddRow.mock.calls[0][0]).toEqual({
      Plugin: "rest-api-plugin",
      Keyword: "given",
      Step: "my definition",
      Comment: "my comment"
    });

    expect(mockAddRow.mock.calls[1][0]).toEqual({
      Plugin: "rest-api-plugin",
      Keyword: "given",
      Step: "my definitions",
      Comment: "my comments"
    });

    expect(mockPrintTable.mock.calls).toHaveLength(0);
    expect(result).toEqual([
      {
        Plugin: "rest-api-plugin",
        Keyword: "given",
        Step: "my definition",
        Comment: "my comment"
      },
      {
        Plugin: "rest-api-plugin",
        Keyword: "given",
        Step: "my definitions",
        Comment: "my comments"
      }
    ]);
  });

  test("Load the steps search tags but the keyword doesnt return any steps", () => {
    const content = `
---

version: 0.0.1
metadata:
  code: API
  name: My test API
  description: The decription of the test api
tests:
  local:
    port: 8089
    command: npm run dev
    `;
    const filename = jestqa.createTmpFile(content, ".restqa.yml");

    const mockPluginAPI = new Plugin("rest-api-plugin");
    mockPluginAPI
      .addGivenStep("my definition", () => {}, "my comment", "header")
      .addGivenStep("my definitions", () => {}, "my comments", "headers")
      .addGivenStep("ma definition", () => {}, "mon commentaire", "api");
    jest.mock("@restqa/rest-api-plugin", () => mockPluginAPI);

    const mockAddRow = jest.fn();
    const mockPrintTable = jest.fn();
    const mockTable = jest.fn(() => {
      return {
        addRow: mockAddRow,
        printTable: mockPrintTable
      };
    });

    jest.mock("console-table-printer", () => {
      return {
        Table: mockTable
      };
    });

    const Steps = require("./steps");
    const result = Steps("Then", {
      config: filename,
      tag: "header",
      print: false
    });

    expect(mockTable.mock.calls).toHaveLength(1);
    expect(mockTable.mock.calls[0][0].columns[0].name).toEqual("Plugin");
    expect(mockTable.mock.calls[0][0].columns[1].name).toEqual("Keyword");
    expect(mockTable.mock.calls[0][0].columns[2].name).toEqual("Step");
    expect(mockTable.mock.calls[0][0].columns[3].name).toEqual("Comment");

    expect(mockAddRow.mock.calls).toHaveLength(0);
    expect(mockPrintTable.mock.calls).toHaveLength(0);
    expect(result).toEqual([]);
  });
});
