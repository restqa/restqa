const nock = require("nock");
const got = require("got");
const path = require("path");
const fs = require("fs");
const os = require("os");
const rimraf = require("rimraf");
const {EventEmitter} = require("events");
const YAML = require("yaml");

let filename;
let server;

const jestqa = new JestQA(__filename, false);

beforeEach(jestqa.beforeEach);
afterEach(jestqa.afterEach);

afterEach(() => {
  if (filename && fs.existsSync(filename)) {
    fs.unlinkSync(filename);
    filename = undefined;
  }
  if (server) {
    server.close();
    server = undefined;
  }
});

beforeEach(() => {
  if (filename && fs.existsSync(filename)) {
    fs.unlinkSync(filename);
    filename = undefined;
  }
});

let buggedReportforlder;
afterAll(() => {
  if (buggedReportforlder && fs.existsSync(buggedReportforlder)) {
    rimraf.sync(buggedReportforlder);
  }
  nock.cleanAll();
  nock.enableNetConnect();
});

jest.mock("../utils/logger", () => {
  return {
    info: jest.fn(),
    log: jest.fn(),
    success: jest.fn()
  };
});

const app = require("./index");

const getGotInstance = function (port) {
  return got.extend({
    prefixUrl: `http://127.0.0.1:${port}`,
    responseType: "json",
    throwHttpErrors: false
  });
};

describe("#dashboard > Server", () => {
  describe("cors management", () => {
    test("does not return allows headers if the origin is not on the default white list", async () => {
      const config = {};
      server = app(config).listen(0);
      const instance = getGotInstance(server.address().port);
      const response = await instance.get("tes-cors");
      expect(response.statusCode).toBe(404);
      expect(response.headers["access-control-allow-origin"]).toBeUndefined();
      expect(response.headers["access-control-allow-headers"]).toBeUndefined();
    });

    test("return allows headers if the origin is on the default white list", async () => {
      const config = {};
      server = app(config).listen(0);
      const instance = getGotInstance(server.address().port);
      const response = await instance.get("tes-cors", {
        headers: {
          origin: "http://localhost:3000"
        }
      });
      expect(response.statusCode).toBe(404);
      expect(response.headers["access-control-allow-origin"]).toBe(
        "http://localhost:3000"
      );
      expect(response.headers["access-control-allow-headers"]).toBe(
        "Origin, X-Requested-With, Content-Type, Accept"
      );
    });

    test("return allows headers if the origin is on the config white list", async () => {
      const config = {};
      const options = {
        server: {
          whiteList: "https://www.foo-bar.com"
        }
      };
      server = app(config, options).listen(0);
      const instance = getGotInstance(server.address().port);
      const response = await instance.get("tes-cors", {
        headers: {
          origin: "https://www.foo-bar.com"
        }
      });
      expect(response.statusCode).toBe(404);
      expect(response.headers["access-control-allow-origin"]).toBe(
        "https://www.foo-bar.com"
      );
      expect(response.headers["access-control-allow-headers"]).toBe(
        "Origin, X-Requested-With, Content-Type, Accept"
      );
    });
  });

  describe("/version", () => {
    test("get version", async () => {
      const pkg = require("../../package.json");
      const config = {};
      server = app(config).listen(0);
      const instance = getGotInstance(server.address().port);
      const response = await instance.get("version");
      expect(response.statusCode).toBe(200);
      expect(response.body.version).toBe(pkg.version);
    });
  });

  describe("/preferences", () => {
    test("Return the user preferences", async () => {
      const content = JSON.stringify({telemetry: true});
      filename = path.resolve(os.homedir(), ".config", "restqa.pref");
      const dirpath = path.dirname(filename);
      fs.mkdirSync(dirpath, {recursive: true});

      fs.writeFileSync(filename, content);

      server = app().listen(0);
      const instance = getGotInstance(server.address().port);
      const response = await instance.get("preferences");
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(JSON.parse(content));
    });

    test("Return the user preferences if the file doesn't exist", async () => {
      server = app().listen(0);
      const instance = getGotInstance(server.address().port);
      const response = await instance.get("preferences");
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({});
    });
  });

  describe("/config", () => {
    test('throw error if server is running on "NO CONFIG" mode', async () => {
      const config = false;
      server = app(config).listen(0);
      const instance = getGotInstance(server.address().port);
      const response = await instance.get("config");
      expect(response.statusCode).toBe(403);
      expect(response.body.message).toBe(
        "Please initiate your RestQA project before using this endpoint."
      );
    });

    test("Return the configuration", async () => {
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
      - name: 'restqa/restqapi'
        config:
          url: http://localhost:3000
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
      `;
      filename = path.resolve(os.tmpdir(), ".restqa.yml");
      fs.writeFileSync(filename, content);

      server = app(filename).listen(0);
      const instance = getGotInstance(server.address().port);
      const response = await instance.get("config");
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(YAML.parse(content));
    });

    test("Return the configuration but overriding the readOnly flag", async () => {
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
      - name: 'restqa/restqapi'
        config:
          url: http://localhost:3000
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
restqa:
  dashboard:
    readOnly: true
      `;
      filename = path.resolve(os.tmpdir(), ".restqa.yml");
      fs.writeFileSync(filename, content);

      server = app(filename, {readOnly: false}).listen(0);
      const instance = getGotInstance(server.address().port);
      const response = await instance.get("config");
      expect(response.statusCode).toBe(200);
      const expected = YAML.parse(content);
      expected.restqa.dashboard.readOnly = false;
      expect(response.body).toEqual(expected);
    });

    test("Create the config only in case of hook and config doesn't exist", async () => {
      nock("https://restqa.io").get("/welcome.json").reply(200, {
        foo: "bar"
      });
      const folder = jestqa.getTmpFolder();
      const content = JSON.stringify({
        name: "microservice-account",
        description: "The description of the microservice",
        dependencies: {
          got: "1.0.0"
        }
      });
      filename = path.resolve(folder, "package.json");
      const configFile = path.resolve(folder, ".restqa.yml");
      fs.writeFileSync(filename, content);

      const opt = {
        folder,
        isHooked: true
      };
      server = app(configFile, opt).listen(0);
      const instance = getGotInstance(server.address().port);
      const response = await instance.get("config");
      expect(response.statusCode).toBe(200);
      const expectedContent = `
---

version: 0.0.1
metadata:
  code: MICROSERVICE-ACCOUNT
  name: microservice-account
  description: The description of the microservice
environments:
  - name: local
    default: true
    plugins:
      - name: '@restqa/restqapi'
        config:
          url: http://localhost:${server.address().port}
    outputs:
      - type: html
        enabled: true
      - type: file
        enabled: true
        config:
          path: 'restqa-result.json'
      `;
      const expected = YAML.parse(expectedContent);
      expect(response.body).toEqual(expected);
    });

    test("Create the config only in case of hook and config doesn't exist (no description on package.json)", async () => {
      nock("https://restqa.io").get("/welcome.json").reply(200, {
        foo: "bar"
      });
      const folder = jestqa.getTmpFolder();
      const content = JSON.stringify({
        name: "microservice-account",
        description: "",
        dependencies: {
          got: "1.0.0"
        }
      });
      filename = path.resolve(folder, "package.json");
      const configFile = path.resolve(folder, ".restqa.yml");
      fs.writeFileSync(filename, content);

      const opt = {
        folder,
        isHooked: true
      };
      server = app(configFile, opt).listen(0);
      const instance = getGotInstance(server.address().port);
      const response = await instance.get("config");
      expect(response.statusCode).toBe(200);
      const expectedContent = `
---

version: 0.0.1
metadata:
  code: MICROSERVICE-ACCOUNT
  name: microservice-account
  description: microservice-account
environments:
  - name: local
    default: true
    plugins:
      - name: '@restqa/restqapi'
        config:
          url: http://localhost:${server.address().port}
    outputs:
      - type: html
        enabled: true
      - type: file
        enabled: true
        config:
          path: 'restqa-result.json'
      `;
      const expected = YAML.parse(expectedContent);
      expect(response.body).toEqual(expected);
    });
  });

  describe("/api/steps", () => {
    test('throw error if server is running on "NO CONFIG" mode', async () => {
      const config = false;
      server = app(config, {readOnly: false}).listen(0);
      const instance = getGotInstance(server.address().port);
      const response = await instance.get("api/restqa/steps?keyword=cool");
      expect(response.statusCode).toBe(403);
      expect(response.body.message).toBe(
        "Please initiate your RestQA project before using this endpoint."
      );
    });

    test("throw error if the keyword is not incorrect", async () => {
      const config = ".restqa.yml";
      server = app(config, {readOnly: false}).listen(0);
      const instance = getGotInstance(server.address().port);
      const response = await instance.get("api/restqa/steps?keyword=cool");
      expect(response.statusCode).toBe(406);
      expect(response.body.message).toBe(
        '"cool" is not a valid argument. Available: given | when | then'
      );
    });

    test("Return the expected steps", async () => {
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
      - name: '@restqa/restqapi'
        config:
          url: http://localhost:3000
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
      `;
      filename = path.resolve(os.tmpdir(), ".restqa.yml");
      fs.writeFileSync(filename, content);

      server = app(filename).listen(0);
      const instance = getGotInstance(server.address().port);
      const response = await instance.get("api/restqa/steps?keyword=when");
      expect(response.statusCode).toBe(200);
      const expectedResult = [
        {
          comment: "Trigger the api request",
          keyword: "when",
          plugin: "restqapi",
          step: "I run the API"
        }
      ];
      expect(response.body).toEqual(expectedResult);
    });

    test("Return all the steps if no keyword is passed", async () => {
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
      - name: '@restqa/restqapi'
        config:
          url: http://localhost:3000
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
      `;
      filename = path.resolve(os.tmpdir(), ".restqa.yml");
      fs.writeFileSync(filename, content);

      server = app(filename).listen(0);
      const instance = getGotInstance(server.address().port);
      const response = await instance.get("api/restqa/steps");
      expect(response.statusCode).toBe(200);
      expect(response.body.length > 10).toBe(true);
      expect(response.body.some((el) => el.keyword === "given")).toBe(true);
      expect(response.body.some((el) => el.keyword === "when")).toBe(true);
      expect(response.body.some((el) => el.keyword === "then")).toBe(true);
    });
  });

  describe("/api/initialize", () => {
    test("throw error if name is not defined", async () => {
      const folder = jestqa.getTmpFolder();
      const config = {};
      server = app(config).listen(0);
      const instance = getGotInstance(server.address().port);
      const response = await instance.post("api/restqa/initialize", {
        json: {
          folder
        }
      });
      expect(response.statusCode).toBe(406);
      expect(response.body.message).toBe("Please share a project name.");
    });

    test("throw error if port is not defined", async () => {
      const folder = jestqa.getTmpFolder();
      const config = {};
      server = app(config).listen(0);
      const instance = getGotInstance(server.address().port);
      const response = await instance.post("api/restqa/initialize", {
        json: {
          name: "Backend api",
          description: "All the API used by the different frontends",
          folder
        }
      });
      expect(response.statusCode).toBe(406);
      expect(response.body.message).toBe("Please share a project port.");
    });

    test("throw error if ci tool is invalid", async () => {
      const folder = jestqa.getTmpFolder();
      const config = {};
      server = app(config).listen(0);
      const instance = getGotInstance(server.address().port);
      const response = await instance.post("api/restqa/initialize", {
        json: {
          name: "Backend api",
          description: "All the API used by the different frontends",
          port: 9090,
          ci: "gocd",
          folder
        }
      });
      expect(response.statusCode).toBe(406);
      expect(response.body.message).toBe(
        'The continous integration "gocd" is not supported by RestQa'
      );
    });

    test("Create a new restqa project", async () => {
      nock("https://restqa.io").get("/welcome.json").reply(200, {
        foo: "bar"
      });

      const folder = jestqa.getTmpFolder();
      const config = {};
      server = app(config).listen(0);
      const instance = getGotInstance(server.address().port);
      const response = await instance.post("api/restqa/initialize", {
        json: {
          name: "Backend api",
          description: "All the API used by the different frontends",
          ci: "gitlab-ci",
          port: 9090,
          folder
        }
      });
      expect(response.statusCode).toBe(200);
      expect(response.body.configuration).toBe(
        path.join(folder, ".restqa.yml")
      );
      expect(response.body.folder).toEqual(folder);
      expect(fs.existsSync(path.join(folder, ".restqa.yml"))).toBe(true);
      expect(fs.existsSync(path.join(folder, ".gitlab-ci.yml"))).toBe(true);
      expect(
        fs.existsSync(
          path.join(folder, "tests", "integration", "welcome-restqa.feature")
        )
      ).toBe(true);

      const responseConfig = await instance.get("config");
      expect(responseConfig.statusCode).toBe(200);
    });
  });

  describe("/api/generate", () => {
    test("throw error if the command is not a curl command", async () => {
      const config = {};
      server = app(config).listen(0);
      const instance = getGotInstance(server.address().port);
      const response = await instance.post("api/restqa/generate", {
        json: {
          cmd: "ls -lah"
        }
      });
      expect(response.statusCode).toBe(406);
      expect(response.body.message).toBe(
        "You need to provide a curl command for me to generate an awesome scenario"
      );
    });

    test("Generate the curl command", async () => {
      nock("https://jsonplaceholder.typicode.com").get("/todos/1").reply(200, {
        userId: 1,
        id: 1,
        title: "delectus aut autem",
        completed: false
      });

      filename = path.resolve(os.tmpdir(), ".restqa.yml");

      server = app(filename).listen(0);
      const instance = getGotInstance(server.address().port);
      const response = await instance.post("api/restqa/generate", {
        json: {
          cmd: "curl -X GET https://jsonplaceholder.typicode.com/todos/1"
        }
      });

      expect(response.statusCode).toBe(200);
      const expectedBody = {
        scenario: `
Given I have the api gateway hosted on "https://jsonplaceholder.typicode.com"
  And I have the path "/todos/1"
  And I have the method "GET"
When I run the API
Then I should receive a response with the status 200
  And the response body should be equal to:
  """
{
  "userId": 1,
  "id": 1,
  "title": "delectus aut autem",
  "completed": false
}
  """`.trim()
      };
      expect(response.body).toEqual(expectedBody);
    });
  });

  describe("/api/install", () => {
    test('throw error if server is running on "NO CONFIG" mode', async () => {
      const config = false;
      server = app(config).listen(0);
      const instance = getGotInstance(server.address().port);
      const response = await instance.post("api/restqa/install");
      expect(response.statusCode).toBe(403);
      expect(response.body.message).toBe(
        "Please initiate your RestQA project before using this endpoint."
      );
    });

    test("throw error if the integration to install doesn't exist", async () => {
      const config = "./restqa.yml";
      const options = {
        name: "whatsapp",
        env: "prod",
        config: {
          url: "http://webhook.whatsapp.com/test"
        }
      };
      server = app(config).listen(0);
      const instance = getGotInstance(server.address().port);
      const response = await instance.post("api/restqa/install", {
        json: options
      });
      expect(response.statusCode).toBe(406);
      expect(response.body.message).toBe(
        'The plugin "whatsapp" is not available. Use the command "restqa install" to retrive the list of available plugin'
      );
    });

    test("throw error if the env is not passed", async () => {
      const config = "./restqa.yml";
      const options = {
        name: "slack",
        config: {
          url: "http://webhook.slack.com/test"
        }
      };
      server = app(config).listen(0);
      const instance = getGotInstance(server.address().port);
      const response = await instance.post("api/restqa/install", {
        json: options
      });
      expect(response.statusCode).toBe(406);
      expect(response.body.message).toBe(
        "Please specify the target environment"
      );
    });

    test("throw error if the env is not available", async () => {
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
      - name: '@restqa/restqapi'
        config:
          url: http://localhost:3000
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
      `;
      filename = path.resolve(os.tmpdir(), ".restqa.yml");
      fs.writeFileSync(filename, content);

      const options = {
        name: "slack",
        env: "prod",
        config: {
          url: "http://webhook.slack.com/test"
        }
      };
      server = app(filename).listen(0);
      const instance = getGotInstance(server.address().port);
      const response = await instance.post("api/restqa/install", {
        json: options
      });
      expect(response.statusCode).toBe(406);
      expect(response.body.message).toBe(
        '"prod" is not an environment available in the config file, choose between : local'
      );
    });

    test("Install slack", async () => {
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
      - name: '@restqa/restqapi'
        config:
          url: http://localhost:3000
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
      `;
      filename = path.resolve(os.tmpdir(), ".restqa.yml");
      fs.writeFileSync(filename, content);

      const options = {
        name: "slack",
        env: "local",
        config: {
          url: "http://webhook.slack.com/test"
        }
      };

      server = app(filename).listen(0);
      const instance = getGotInstance(server.address().port);
      const response = await instance.post("api/restqa/install", {
        json: options
      });
      expect(response.statusCode).toBe(201);
      const expectedResult = `version: 0.0.1
metadata:
  code: API
  name: My test API
  description: The decription of the test api
environments:
  - name: local
    default: true
    plugins:
      - name: "@restqa/restqapi"
        config:
          url: http://localhost:3000
    outputs:
      - type: file
        enabled: true
        config:
          path: my-report.json
      - type: slack
        enabled: true
        config:
          url: http://webhook.slack.com/test
          onlyFailed: false
`;
      expect(response.body.config).toEqual(expectedResult);
    });
  });

  describe("/api/run", () => {
    beforeEach(() => {
      jest.resetModules();
      jest.resetAllMocks();
    });

    test('throw error if server is running on "NO CONFIG" mode', async () => {
      const config = false;
      server = app(config).listen(0);
      const instance = getGotInstance(server.address().port);
      const response = await instance.post("api/restqa/run");
      expect(response.statusCode).toBe(403);
      expect(response.body.message).toBe(
        "Please initiate your RestQA project before using this endpoint."
      );
    });

    test("throw error if the configuration file  doesn't exist", async () => {
      jest.mock("../../bin/program", () => {
        return {
          program: {
            parseAsync: jest.fn().mockResolvedValue(true)
          }
        };
      });
      const {program} = require("../../bin/program");

      const config = "./.restqa.yml";
      const json = {
        env: "prod"
      };
      server = app(config).listen(0);
      const instance = getGotInstance(server.address().port);
      await instance.post("api/restqa/run", {json});

      expect(program.parseAsync).toHaveBeenCalled();
    });

    test("Run the test and get the result", async () => {
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
      - name: '@restqa/restqapi'
        config:
          url: http://localhost:3000
      `;
      filename = path.resolve(os.tmpdir(), ".restqa.yml");
      fs.writeFileSync(filename, content);

      const mockRun = jest.fn().mockResolvedValue({foo: "bar"});
      jest.mock("../index", () => {
        return {
          Run: mockRun
        };
      });
      server = require("./index")(filename).listen();

      const json = {
        env: "local",
        path: "tests/"
      };
      const instance = getGotInstance(server.address().port);
      const response = await instance.post("api/restqa/run", {json});
      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({foo: "bar"});
    });

    test("Run the test and get the result reusing the test folder", async () => {
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
      - name: '@restqa/restqapi'
        config:
          url: http://localhost:3000
      `;
      filename = path.resolve(os.tmpdir(), ".restqa.yml");
      fs.writeFileSync(filename, content);

      const mockRun = jest.fn().mockResolvedValue({foo: "bar"});
      jest.mock("../index", () => {
        return {
          Run: mockRun
        };
      });

      const srvOption = {
        server: {
          testFolder: path.resolve(__dirname, "../../example/tests")
        }
      };
      server = require("./index")(filename, srvOption).listen();

      const json = {
        env: "local",
        path: "integration/delete-todos-id.feature"
      };
      const instance = getGotInstance(server.address().port);
      const response = await instance.post("api/restqa/run", {json});

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({foo: "bar"});
      const expectedResult = {
        path: path.join(srvOption.server.testFolder, json.path)
      };
      expect(mockRun.mock.calls[0][0].path).toEqual(expectedResult.path);
    });
  });

  describe("/report", () => {
    let reportFolder;

    beforeEach(() => {
      if (fs.existsSync(reportFolder)) {
        rimraf.sync(reportFolder);
      }
    });

    afterEach(() => {
      if (fs.existsSync(reportFolder)) {
        rimraf.sync(reportFolder);
      }
    });

    test("Create a report for a result using default value", async () => {
      const json = {
        id: `xx-yyy-zzzz-${Math.floor(Math.random() * 1000)}`
      };

      buggedReportforlder = path.resolve(process.cwd(), "reports");

      const config = {};
      server = app(config).listen();
      const {port} = server.address();
      const instance = getGotInstance(port);
      const response = await instance.post("reports", {json});
      expect(response.statusCode).toBe(201);
      expect(response.body.id).toEqual(json.id);
      expect(response.body.url).toEqual(
        `http://127.0.0.1:${port}/reports/${json.id}`
      );
      const expectedReport = path.resolve(
        buggedReportforlder,
        json.id,
        "index.html"
      );
      expect(fs.existsSync(expectedReport)).toBe(true);
    });

    test("Create a report for a result using passed options", async () => {
      const json = {
        id: `xx-yyy-zzzz-${Math.floor(Math.random() * 1000)}`
      };

      reportFolder = path.resolve(os.tmpdir(), "reports");

      const config = {};
      const options = {
        server: {
          report: {
            urlPrefixPath: "/reports-restqa",
            outputFolder: reportFolder
          }
        }
      };
      server = app(config, options).listen();
      const {port} = server.address();
      const instance = getGotInstance(port);
      const response = await instance.post("reports", {json});
      expect(response.statusCode).toBe(201);
      expect(response.body.id).toEqual(json.id);
      expect(response.body.url).toEqual(
        `http://127.0.0.1:${port}/reports-restqa/${json.id}`
      );
      const expectedReport = path.resolve(reportFolder, json.id, "index.html");
      expect(fs.existsSync(expectedReport)).toBe(true);
    });

    test("Retrieve the list of report", async () => {
      const json = {
        id: `xx-yyy-zzzz-${Math.floor(Math.random() * 1000)}`
      };

      reportFolder = path.resolve(os.tmpdir(), "reports-gets");
      fs.mkdirSync(reportFolder);

      const config = {};
      const options = {
        server: {
          report: {
            outputFolder: reportFolder
          }
        }
      };

      server = app(config, options).listen();
      const {port} = server.address();
      const instance = getGotInstance(port);
      let response = await instance.get("reports");

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([]);

      await instance.post("reports", {json});

      response = await instance.get("reports");
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].id).toEqual(json.id);
      expect(response.body[0].url).toEqual(
        `http://127.0.0.1:${port}/reports/${json.id}`
      );
    });

    test("Access to the dashboard", async () => {
      const json = {
        id: `xx-yyy-zzzz-${Math.floor(Math.random() * 1000)}`
      };

      reportFolder = path.resolve(os.tmpdir(), "reports-gets");
      fs.mkdirSync(reportFolder);

      const config = {};
      const options = {
        server: {
          report: {
            urlPrefixPath: "/reports-restqa",
            outputFolder: reportFolder
          }
        }
      };

      server = app(config, options).listen();
      const {port} = server.address();
      const instance = getGotInstance(port);
      let response = await instance.get(`reports-restqa/${json.id}`);
      expect(response.statusCode).toBe(404);

      await instance.post("reports", {json});
      response = await instance.get(`reports-restqa/${json.id}`, {
        responseType: "text"
      });

      expect(response.statusCode).toBe(200);
      expect(response.headers["content-type"]).toEqual(
        "text/html; charset=UTF-8"
      );
    });
  });

  describe("/api/tips", () => {
    const Welcome = require("../utils/welcome");

    beforeEach(() => {
      jest.resetModules();
      jest.resetAllMocks();
    });

    test("retrieve a random tip", async () => {
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
      - name: '@restqa/restqapi'
        config:
          url: http://localhost:3000
      `;
      filename = path.resolve(os.tmpdir(), ".restqa.yml");
      fs.writeFileSync(filename, content);

      const srvOption = {};
      server = app(filename, srvOption).listen(0);
      const instance = getGotInstance(server.address().port);
      const response = await instance.get("api/tips");
      expect(response.statusCode).toBe(200);
      const expectedList = new Welcome().MESSAGES.map((str) => {
        const pattern = [
          "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
          "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))"
        ].join("|");
        return str.replace(new RegExp(pattern, "g"), "");
      });
      expect(expectedList).toContain(response.body.message);
    });

    test("retrieve a tip coming from the configuration", async () => {
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
      - name: '@restqa/restqapi'
        config:
          url: http://localhost:3000
restqa:
  tips:
    enabled: true
    messages:
    - This is a custom tips
      `;
      filename = path.resolve(os.tmpdir(), ".restqa.yml");
      fs.writeFileSync(filename, content);

      const srvOption = {};
      server = app(filename, srvOption).listen(0);
      const instance = getGotInstance(server.address().port);
      const response = await instance.get("api/tips");
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toContain("This is a custom tips");
    });
  });

  describe("/api/info", () => {
    beforeEach(() => {
      jest.resetModules();
      jest.resetAllMocks();
    });

    test("share data from the remote restqa server", async () => {
      const emitter = new EventEmitter();
      const mockData = {
        team: {
          note: {
            message: "hello world",
            from: "Olivier",
            avatar: "https://test/olive.png"
          }
        }
      };

      const httpIncomingMessage = {
        statusCode: 200,
        headers: {
          "content-type": "application/json"
        },
        on: jest.fn((evt, fn) => {
          if (evt === "data") {
            fn.call(this, Buffer.from(JSON.stringify(mockData)));
          }
        })
      };

      const mockRequest = jest.fn().mockImplementation((options, callback) => {
        if (callback) {
          callback(httpIncomingMessage);
        }
        emitter.end = jest.fn();
        return emitter;
      });

      jest.mock("https", () => {
        return {
          request: mockRequest
        };
      });

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
      - name: '@restqa/restqapi'
        config:
          url: http://localhost:3000
      `;
      filename = path.resolve(os.tmpdir(), ".restqa.yml");
      fs.writeFileSync(filename, content);
      server = require("./index")(filename).listen(0);
      const instance = getGotInstance(server.address().port);
      const response = await instance.get("api/info");
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockData);
      expect(mockRequest.mock.calls).toHaveLength(1);
      const expectedOption = {
        hostname: "restqa.io",
        port: 443,
        path: "/api/info",
        method: "GET"
      };
      expect(mockRequest.mock.calls[0][0]).toEqual(expectedOption);
    });

    test("share the default message if the result is not json body", async () => {
      const mockData = "<html>";
      const emitter = new EventEmitter();
      const httpIncomingMessage = {
        statusCode: 200,
        headers: {
          "content-type": "text/html"
        },
        on: jest.fn((evt, fn) => {
          if (evt === "data") {
            fn.call(this, Buffer.from(JSON.stringify(mockData)));
          }
        })
      };

      const mockRequest = jest.fn().mockImplementation((options, callback) => {
        if (callback) {
          callback(httpIncomingMessage);
        }
        emitter.end = jest.fn();
        return emitter;
      });

      jest.mock("https", () => {
        return {
          request: mockRequest
        };
      });

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
      - name: '@restqa/restqapi'
        config:
          url: http://localhost:3000
      `;
      filename = path.resolve(os.tmpdir(), ".restqa.yml");
      fs.writeFileSync(filename, content);
      server = require("./index")(filename).listen(0);
      const instance = getGotInstance(server.address().port);
      const response = await instance.get("api/info");
      expect(response.statusCode).toBe(200);
      const defaultData = {
        team: {
          blog: {
            url: "https://medium.com/restqa",
            last: {
              title:
                "RestQA is here! Do your end-to-end API test integration, the right way!",
              date: "2021-02-02 02:24:19",
              image:
                "https://cdn-images-1.medium.com/max/1024/1*iyyY6QkAAE2bOzNRevfCuw.png",
              author: {
                username: "@Olivierodo",
                avatar:
                  "https://cdn-images-1.medium.com/fit/c/150/150/1*acYALd6w84KRScRNMpFLUg.jpeg"
              },
              url: "https://medium.com/restqa/restqa-is-here-do-your-end-to-end-api-test-integration-the-right-way-84b7313e1291"
            }
          },
          video: {
            url: "https://www.youtube.com/channel/UCdT6QenNLmnxNT-aT8nYq_Q",
            last: {
              title: "RestQA",
              date: "2021-04-17 03:00:30",
              image: "https://i2.ytimg.com/vi/EberYFGPZPo/hqdefault.jpg",
              url: "https://www.youtube.com/watch?v=EberYFGPZPo"
            }
          },
          note: {
            message:
              "We are happy to have you in the RestQA Family, we are happy to support you on your testing journey. ❤️",
            from: "RestQA team",
            avatar: "/logo.png"
          }
        },
        sponsors: [
          {
            url: "https://atalent-consulting.com",
            name: "Atalent Consulting",
            logo: "https://atalent-consulting.com/sponsor.png"
          }
        ]
      };
      expect(response.body).toEqual(defaultData);
      expect(mockRequest.mock.calls).toHaveLength(1);
    });

    test("share the default information if the calls fail", async () => {
      const httpIncomingMessage = {
        statusCode: 500,
        headers: {},
        on: () => {
          // emitter.emit('error', new Error('oups'))
        }
      };

      const mockRequest = jest.fn().mockImplementation((options, callback) => {
        if (callback) {
          callback(httpIncomingMessage);
        }
        const req = {
          on: (evt, fn) => {
            fn(new Error("couocu"));
          },
          end: jest.fn()
        };
        return req;
      });

      jest.mock("https", () => {
        return {
          request: mockRequest
        };
      });

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
      - name: '@restqa/restqapi'
        config:
          url: http://localhost:3000
      `;
      filename = path.resolve(os.tmpdir(), ".restqa.yml");
      fs.writeFileSync(filename, content);
      server = require("./index")(filename).listen(0);
      const instance = getGotInstance(server.address().port);
      const response = await instance.get("api/info");
      expect(response.statusCode).toBe(200);
      const defaultData = {
        team: {
          blog: {
            url: "https://medium.com/restqa",
            last: {
              title:
                "RestQA is here! Do your end-to-end API test integration, the right way!",
              date: "2021-02-02 02:24:19",
              image:
                "https://cdn-images-1.medium.com/max/1024/1*iyyY6QkAAE2bOzNRevfCuw.png",
              author: {
                username: "@Olivierodo",
                avatar:
                  "https://cdn-images-1.medium.com/fit/c/150/150/1*acYALd6w84KRScRNMpFLUg.jpeg"
              },
              url: "https://medium.com/restqa/restqa-is-here-do-your-end-to-end-api-test-integration-the-right-way-84b7313e1291"
            }
          },
          video: {
            url: "https://www.youtube.com/channel/UCdT6QenNLmnxNT-aT8nYq_Q",
            last: {
              title: "RestQA",
              date: "2021-04-17 03:00:30",
              image: "https://i2.ytimg.com/vi/EberYFGPZPo/hqdefault.jpg",
              url: "https://www.youtube.com/watch?v=EberYFGPZPo"
            }
          },
          note: {
            message:
              "We are happy to have you in the RestQA Family, we are happy to support you on your testing journey. ❤️",
            from: "RestQA team",
            avatar: "/logo.png"
          }
        },
        sponsors: [
          {
            url: "https://atalent-consulting.com",
            name: "Atalent Consulting",
            logo: "https://atalent-consulting.com/sponsor.png"
          }
        ]
      };
      expect(response.body).toEqual(defaultData);
      expect(mockRequest.mock.calls).toHaveLength(1);
    });
  });

  describe("/api/project/features", () => {
    beforeEach(() => {
      jest.resetModules();
      jest.resetAllMocks();
    });

    test("Retrieve the list of tests", async () => {
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
      - name: '@restqa/restqapi'
        config:
          url: http://localhost:3000
      `;
      filename = path.resolve(os.tmpdir(), ".restqa.yml");
      fs.writeFileSync(filename, content);
      const srvOption = {
        server: {
          testFolder: path.resolve(__dirname, "../../example/tests")
        }
      };
      server = app(filename, srvOption).listen(0);
      const instance = getGotInstance(server.address().port);
      const response = await instance.get("api/project/features");
      expect(response.statusCode).toBe(200);
      const expectedBody = [
        "integration/delete-todos-id.feature",
        "integration/get-todos-id.feature",
        "integration/get-todos.feature",
        "integration/patch-todos.feature",
        "integration/post-todos.feature",
        "integration/put-todos.feature"
      ];
      expect(response.body).toEqual(expectedBody);
    });
  });

  describe("/api/project/features/{path}", () => {
    beforeEach(() => {
      jest.resetModules();
      jest.resetAllMocks();
    });

    describe("Retrieve content file", () => {
      test("Retrieve the content of a specific feature", async () => {
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
      - name: '@restqa/restqapi'
        config:
          url: http://localhost:3000
        `;
        filename = path.resolve(os.tmpdir(), ".restqa.yml");
        fs.writeFileSync(filename, content);

        const srvOption = {
          server: {
            testFolder: path.resolve(__dirname, "../../example/tests")
          }
        };
        const featureFilename = "integration/delete-todos-id.feature";
        server = app(filename, srvOption).listen(0);
        const instance = getGotInstance(server.address().port);
        const response = await instance.get(
          "api/project/features/" + featureFilename,
          {responseType: "text"}
        );
        expect(response.statusCode).toBe(200);
        const expectedBody = fs
          .readFileSync(
            path.resolve(__dirname, "../../example/tests", featureFilename)
          )
          .toString("utf-8");
        expect(response.body).toEqual(expectedBody);
      });

      test("throw error if the file doesnt exist", async () => {
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
      - name: '@restqa/restqapi'
        config:
          url: http://localhost:3000
        `;
        filename = path.resolve(os.tmpdir(), ".restqa.yml");
        fs.writeFileSync(filename, content);

        const srvOption = {
          server: {
            testFolder: path.resolve(__dirname, "../../example/tests")
          }
        };
        server = app(filename, srvOption).listen(0);
        const instance = getGotInstance(server.address().port);
        const response = await instance.get(
          "api/project/features/foo-bar.feature"
        );
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({
          message: `The file "foo-bar.feature" doesn't exist in the folder "${srvOption.server.testFolder}"`
        });
      });
    });

    describe("Save content file", () => {
      test("Save the content of a specific feature", async () => {
        let content = `
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
      - name: '@restqa/restqapi'
        config:
          url: http://localhost:3000
        `;
        let filename = path.resolve(os.tmpdir(), ".restqa.yml");
        fs.writeFileSync(filename, content);

        content = "foo bar";
        const featureFilename = "unit-test.feature";
        filename = path.resolve(os.tmpdir(), featureFilename);
        fs.writeFileSync(filename, content);

        const srvOption = {
          server: {
            testFolder: os.tmpdir()
          }
        };
        server = app(filename, srvOption).listen(0);
        const instance = getGotInstance(server.address().port);
        const response = await instance.put(
          "api/project/features/" + featureFilename,
          {
            headers: {
              "Content-Type": "text/plain"
            },
            body: "this is the new content"
          }
        );

        expect(response.statusCode).toBe(204);
        const fileContent = fs
          .readFileSync(path.resolve(os.tmpdir(), featureFilename))
          .toString("utf-8");
        expect(fileContent).toEqual("this is the new content");
      });

      test("Save the content of a specific feature in a folder", async () => {
        let content = `
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
      - name: '@restqa/restqapi'
        config:
          url: http://localhost:3000
        `;
        let filename = path.resolve(os.tmpdir(), ".restqa.yml");
        fs.writeFileSync(filename, content);

        content = "foo bar";
        const featureFilename = "unit-test.feature";
        filename = path.resolve(os.tmpdir(), featureFilename);
        fs.writeFileSync(filename, content);

        const srvOption = {
          folder: os.tmpdir()
        };

        server = app(filename, srvOption).listen(0);
        const instance = getGotInstance(server.address().port);
        const response = await instance.put(
          "api/project/features/" + featureFilename,
          {
            headers: {
              "Content-Type": "text/plain"
            },
            body: "this is the new content"
          }
        );

        expect(response.statusCode).toBe(204);
        const fileContent = fs
          .readFileSync(path.resolve(os.tmpdir(), featureFilename))
          .toString("utf-8");
        expect(fileContent).toEqual("this is the new content");
      });

      test("throw error if the file doesnt exist", async () => {
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
      - name: '@restqa/restqapi'
        config:
          url: http://localhost:3000
        `;
        filename = path.resolve(os.tmpdir(), ".restqa.yml");
        fs.writeFileSync(filename, content);

        const srvOption = {
          server: {
            testFolder: path.resolve(__dirname, "../../example/tests")
          }
        };
        server = app(filename, srvOption).listen(0);
        const instance = getGotInstance(server.address().port);
        const response = await instance.put(
          "api/project/features/foo-bar.feature",
          {
            headers: {
              "Content-Type": "text/plain"
            },
            body: "this is the new content"
          }
        );
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({
          message: `The file "foo-bar.feature" doesn't exist in the folder "${srvOption.server.testFolder}"`
        });
      });
    });
  });

  describe("/events", () => {
    afterEach(() => {
      jest.useRealTimers();
    });
    const Sandbox = require("../core/sandbox");
    test("Throw error if the sandbox mode is not enabled", async () => {
      server = app(false).listen(0);
      const instance = getGotInstance(server.address().port);
      const response = await instance.get("events");
      expect(response.statusCode).toBe(406);
      expect(response.body).toEqual({
        message: "The sandbox mode is not enabled"
      });
    });

    test("Send event when the sandbox got triggered", () => {
      let stream;
      return new Promise((resolve, reject) => {
        jest.useFakeTimers("modern");
        jest.setSystemTime(new Date("2012-10-10"));
        const options = {
          sandbox: new Sandbox()
        };

        const incomingRequest = {};

        server = app(false, options).listen(0);
        const instance = getGotInstance(server.address().port);

        stream = instance
          .stream("events")
          .on("response", (response) => {
            try {
              expect(response.headers["cache-control"]).toBe("no-cache");
              expect(response.headers["content-type"]).toBe(
                "text/event-stream; charset=utf-8"
              );
              expect(response.headers.connection).toBe("keep-alive");
              expect(response.headers["transfer-encoding"]).toBe("chunked");
            } catch (e) {
              reject(e);
            }

            options.sandbox.emit("request", incomingRequest);
            server.close();
          })
          .on("data", (chunk) => {
            const data = chunk.toString();
            const expectedBody = JSON.stringify({
              transaction: incomingRequest,
              status: "PENDING",
              scenario:
                "An error occured while generating the test: Please specify your url",
              createdAt: new Date("2012-10-10")
            });
            expect(data).toEqual(`data: ${expectedBody}\n\n`);
            resolve(stream);
          });
      }).then((stream) => {
        stream.destroy();
        server.close();
      });
    });
  });
});
