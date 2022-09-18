const Stream = require("stream");
const Welcome = require("../utils/welcome");
const Global = require("../core/global");

const {MESSAGES} = new Welcome();

const jestqa = new JestQA(__filename, true);

beforeEach(jestqa.beforeEach);
afterEach(jestqa.afterEach);

jestqa.hooks.beforeEach = function () {
  delete process.env.RESTQA_ENV;
  delete process.env.RESTQA_CONFIG;
  delete process.env.GITHUB_REPOSITORY;
  delete process.env.CI_PROJECT_PATH;
  delete process.env.BITBUCKET_REPO_SLUG;
  delete process.env.RESTQA_REPOSITORY;
  delete process.env.GITHUB_SHA;
  delete process.env.CI_COMMIT_SHA;
  delete process.env.BITBUCKET_COMMIT;
  delete process.env.RESTQA_COMMIT_SHA;

  delete global.restqa;
};

describe("restqa-formatter", () => {
  test("Do not Export information for the local tests (default behavior)", () => {
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
`;
    const filename = jestqa.createTmpFile(content, ".restqa.yml");

    const mockGetFormatter = jest.fn();
    jest.mock("@restqa/cucumber-export", () => {
      return {
        getFormatter: mockGetFormatter
      };
    });

    const options = {
      configFile: filename
    };
    global.restqa = new Global(options);

    require("./export-formatter");

    expect(mockGetFormatter).toHaveBeenCalled();
    const expectedOption = {
      key: "API",
      name: "My test API",
      env: "local",
      outputs: [
        {
          type: "html",
          enabled: false,
          config: {
            folder: "restqa"
          }
        }
      ]
    };
    expect(mockGetFormatter.mock.calls[0][0]).toMatchObject(expectedOption);
    expect(MESSAGES).toContain(mockGetFormatter.mock.calls[0][0].title);
  });

  test("Export information for the local tests", () => {
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
`;
    const filename = jestqa.createTmpFile(content, ".restqa.yml");

    const mockGetFormatter = jest.fn();
    jest.mock("@restqa/cucumber-export", () => {
      return {
        getFormatter: mockGetFormatter
      };
    });

    const options = {
      configFile: filename,
      report: true
    };
    global.restqa = new Global(options);

    require("./export-formatter");

    expect(mockGetFormatter).toHaveBeenCalled();
    const expectedOption = {
      key: "API",
      name: "My test API",
      env: "local",
      outputs: [
        {
          type: "html",
          enabled: true,
          config: {
            folder: "restqa"
          }
        }
      ]
    };
    expect(mockGetFormatter.mock.calls[0][0]).toMatchObject(expectedOption);
    expect(MESSAGES).toContain(mockGetFormatter.mock.calls[0][0].title);
  });

  test("Export information but disabled the tips", () => {
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
  - name: uat
    url: http://test.uat.com
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
settings:
  tips:
    enabled: false
      `;
    const filename = jestqa.createTmpFile(content, ".restqa.yml");

    const mockGetFormatter = jest.fn();
    jest.mock("@restqa/cucumber-export", () => {
      return {
        getFormatter: mockGetFormatter
      };
    });

    const options = {
      configFile: filename,
      env: "uat"
    };
    global.restqa = new Global(options);

    require("./export-formatter");

    expect(mockGetFormatter).toHaveBeenCalled();
    const expectedOption = {
      title: "Exporting the test result...",
      key: "API",
      name: "My test API",
      env: "uat",
      outputs: [
        {
          type: "file",
          enabled: true,
          config: {
            path: "my-report.json"
          }
        }
      ]
    };
    expect(mockGetFormatter.mock.calls[0][0]).toMatchObject(expectedOption);
  });

  test("Export information with custom tips", () => {
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
  - name: uat
    url: http://test.uat.com
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
settings:
  tips:
    messages:
      - This test is passing!
      `;

    const filename = jestqa.createTmpFile(content, ".restqa.yml");

    const mockGetFormatter = jest.fn();
    jest.mock("@restqa/cucumber-export", () => {
      return {
        getFormatter: mockGetFormatter
      };
    });

    process.env.RESTQA_REPOSITORY = "restqa/restqa-test";
    process.env.RESTQA_COMMIT_SHA = "70a94f1b8b568ff6101a9a7fe20bce64f3db1983";

    const options = {
      configFile: filename,
      env: "uat"
    };
    global.restqa = new Global(options);

    require("./export-formatter");

    expect(mockGetFormatter).toHaveBeenCalled();
    const expectedOption = {
      title: "This test is passing!",
      key: "API",
      name: "My test API",
      env: "uat",
      repository: "restqa/restqa-test",
      sha: "70a94f1b8b568ff6101a9a7fe20bce64f3db1983",
      outputs: [
        {
          type: "file",
          enabled: true,
          config: {
            path: "my-report.json"
          }
        }
      ]
    };
    expect(mockGetFormatter.mock.calls[0][0]).toMatchObject(expectedOption);
  });

  test("Export information using default Github info and add a tmp report", () => {
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
  - name: uat
    url: http://test.uat.com
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
settings:
  tips:
    enabled: false
      `;

    const filename = jestqa.createTmpFile(content, ".restqa.yml");

    const mockGetFormatter = jest.fn();
    jest.mock("@restqa/cucumber-export", () => {
      return {
        getFormatter: mockGetFormatter
      };
    });

    process.env.GITHUB_REPOSITORY = "restqa/restqa-github";
    process.env.GITHUB_SHA = "6666f1b8b568ff6101a9a7fe20bce64f3db1983";

    const options = {
      configFile: filename,
      env: "uat",
      exportStream: new Stream.Writable()
    };
    global.restqa = new Global(options);

    require("./export-formatter");

    expect(mockGetFormatter).toHaveBeenCalled();
    const expectedOption = {
      title: "Exporting the test result...",
      key: "API",
      name: "My test API",
      env: "uat",
      repository: "restqa/restqa-github",
      sha: "6666f1b8b568ff6101a9a7fe20bce64f3db1983",
      outputs: [
        {
          type: "file",
          enabled: true,
          config: {
            path: "my-report.json"
          }
        },
        {
          type: "stream",
          enabled: true,
          config: {
            instance: options.exportStream
          }
        }
      ]
    };
    expect(mockGetFormatter.mock.calls[0][0]).toMatchObject(expectedOption);
  });

  test("Export information using default Gitlab info", () => {
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
  - name: uat
    url: http://test.uat.com
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
settings:
  tips:
    enabled: false
      `;

    const filename = jestqa.createTmpFile(content, ".restqa.yml");

    const mockGetFormatter = jest.fn();
    jest.mock("@restqa/cucumber-export", () => {
      return {
        getFormatter: mockGetFormatter
      };
    });

    process.env.CI_PROJECT_PATH = "restqa/restqa-gitlab";
    process.env.CI_COMMIT_SHA = "77777f1b8b568ff6101a9a7fe20bce64f3db1983";

    const options = {
      configFile: filename,
      env: "uat"
    };
    global.restqa = new Global(options);

    require("./export-formatter");

    expect(mockGetFormatter).toHaveBeenCalled();
    const expectedOption = {
      title: "Exporting the test result...",
      key: "API",
      name: "My test API",
      env: "uat",
      repository: "restqa/restqa-gitlab",
      sha: "77777f1b8b568ff6101a9a7fe20bce64f3db1983",
      outputs: [
        {
          type: "file",
          enabled: true,
          config: {
            path: "my-report.json"
          }
        }
      ]
    };
    expect(mockGetFormatter.mock.calls[0][0]).toMatchObject(expectedOption);
  });

  test("Export information using default Bitbucket info", () => {
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
  - name: uat
    url: http://test.uat.com
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
settings:
  tips:
    enabled: false
      `;

    const filename = jestqa.createTmpFile(content, ".restqa.yml");

    const mockGetFormatter = jest.fn();
    jest.mock("@restqa/cucumber-export", () => {
      return {
        getFormatter: mockGetFormatter
      };
    });

    process.env.BITBUCKET_REPO_SLUG = "restqa/restqa-bitbucket";
    process.env.BITBUCKET_COMMIT = "8888f1b8b568ff6101a9a7fe20bce64f3db1983";

    const options = {
      configFile: filename,
      env: "uat"
    };
    global.restqa = new Global(options);

    require("./export-formatter");

    expect(mockGetFormatter).toHaveBeenCalled();
    const expectedOption = {
      title: "Exporting the test result...",
      key: "API",
      name: "My test API",
      env: "uat",
      repository: "restqa/restqa-bitbucket",
      sha: "8888f1b8b568ff6101a9a7fe20bce64f3db1983",
      outputs: [
        {
          type: "file",
          enabled: true,
          config: {
            path: "my-report.json"
          }
        }
      ]
    };
    expect(mockGetFormatter.mock.calls[0][0]).toMatchObject(expectedOption);
  });
});
