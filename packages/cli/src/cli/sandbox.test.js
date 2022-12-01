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
tests:
  local:
    command: npm run dev
    port: 8081
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
  test("Run the cucumber success local tests with passed stdout", async () => {
    jestqa.createTmpFile(validRestQAConfigFile, ".restqa.yml");
    const mockTmpFolder = jestqa.getTmpFolder();

    jest.mock("../utils/process", () => {
      return {
        cwd: mockTmpFolder
      };
    });

    const mockSandbox = jest.fn();
    jest.mock("@restqa/sandbox", () => {
      return mockSandbox;
    });

    const mockExecutor = jest.fn();
    const mockExecutorExecute = jest.fn();
    jest.mock("../core/executor", () => {
      return class {
        constructor(opt) {
          mockExecutor(opt);
        }

        async execute() {
          mockExecutorExecute(null);
        }
      };
    });

    const port = 8999;
    const debug = false;
    const SanboxCli = require("./sandbox");
    await SanboxCli({port, debug});
    expect(mockExecutor).toHaveBeenCalled();
    expect(mockExecutor).toHaveBeenCalledWith({
      port: 8081,
      command: "npm run dev"
    });
    expect(mockExecutorExecute).toHaveBeenCalled();

    expect(mockSandbox).toHaveBeenCalled();
    expect(mockSandbox).toHaveBeenCalledWith({
      port,
      debug,
      upstream: "http://localhost:8081",
      stream: global.restqa.outputStream
    });
  });
});
