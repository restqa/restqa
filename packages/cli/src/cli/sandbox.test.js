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

    const mockMicroservice = jest.fn();
    const mockMicroserviceStart = jest.fn();
    jest.mock("@restqa/core-microservice", () => {
      return class {
        constructor(opt) {
          mockMicroservice(opt);
        }

        async start() {
          mockMicroserviceStart(null);
        }
      };
    });

    const port = 8999;
    const debug = false;
    const SanboxCli = require("./sandbox");
    await SanboxCli({port, debug});
    expect(mockMicroservice).toHaveBeenCalled();
    expect(mockMicroservice).toHaveBeenCalledWith({
      port: 8081,
      command: "npm run dev"
    });
    expect(mockMicroserviceStart).toHaveBeenCalled();

    expect(mockSandbox).toHaveBeenCalled();
    expect(mockSandbox).toHaveBeenCalledWith({
      port,
      debug,
      upstream: "http://localhost:8081",
      stream: global.restqa.outputStream
    });
  });
});
