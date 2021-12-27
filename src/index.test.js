const Stream = require("stream");
const fs = require("fs");

const jestqa = new JestQA(__filename, true);

afterEach(jestqa.afterEach);

describe("# Index - Generate", () => {
  test("Throw an error if the command is not a curl command", () => {
    const {Generate} = require("./index");
    const cmd = "ls -lah";
    return expect(Generate(cmd)).rejects.toThrow(
      "You need to provide a curl command for me to generate an awesome scenario"
    );
  });

  test("Resolve the generate command", async () => {
    const mockGenerate = jest.fn().mockResolvedValue("result");
    jest.mock("./cli/generate", () => {
      return mockGenerate;
    });

    const {Generate} = require("./index");
    const cmd = "curl https://jsonplaceholder.typicode.com/todos/1";
    await expect(Generate(cmd)).resolves.toEqual("result");
    expect(mockGenerate.mock.calls).toHaveLength(1);
    const expectedOption = {
      print: false
    };
    const program = {
      args: ["curl", "https://jsonplaceholder.typicode.com/todos/1"]
    };
    expect(mockGenerate.mock.calls[0][0]).toEqual(expectedOption);
    expect(mockGenerate.mock.calls[0][1]).toEqual(program);
  });

  test("Curl command with a lot of options", async () => {
    const mockGenerate = jest.fn().mockResolvedValue("result");
    jest.mock("./cli/generate", () => {
      return mockGenerate;
    });

    const {Generate} = require("./index");
    const cmd =
      'curl --url https://example/send --header "content-type: application/x-www-form-urlencoded" --cookie "JSESSIONID=B28CABC3FA3059E10CDE5201105D90F1" -d "ACCOUNT=@ccount" --data "PASSWORD=THIS_IS_PASS" --data-raw "MOBILE=09876463" --data "MESSAGE=test-sms"';

    await expect(Generate(cmd)).resolves.toEqual("result");
    expect(mockGenerate.mock.calls).toHaveLength(1);
    const expectedOption = {
      print: false
    };

    const program = {
      args: [
        "curl",
        "--url",
        "https://example/send",
        "--header",
        "content-type: application/x-www-form-urlencoded",
        "--cookie",
        "JSESSIONID=B28CABC3FA3059E10CDE5201105D90F1",
        "-d",
        "ACCOUNT=@ccount",
        "--data",
        "PASSWORD=THIS_IS_PASS",
        "--data-raw",
        "MOBILE=09876463",
        "--data",
        "MESSAGE=test-sms"
      ]
    };
    expect(mockGenerate.mock.calls[0][0]).toEqual(expectedOption);
    expect(mockGenerate.mock.calls[0][1]).toEqual(program);
  });
});

describe("# Index - Step", () => {
  test("Get result from Step defintions", () => {
    const mockSteps = jest.fn().mockReturnValue("result");

    jest.mock("./cli/steps", () => {
      return mockSteps;
    });

    const opt = {
      configFile: "/tmp/.restqa.yml",
      keyword: "then",
      tag: "header"
    };

    const {Steps} = require("./index");
    expect(Steps(opt)).toEqual("result");
    expect(mockSteps.mock.calls).toHaveLength(1);
    expect(mockSteps.mock.calls[0][0]).toEqual("then");
    expect(mockSteps.mock.calls[0][1]).toEqual({
      config: "/tmp/.restqa.yml",
      tag: "header",
      print: false
    });
  });

  test("Get result from Step defintions (default value)", () => {
    const mockSteps = jest.fn().mockReturnValue("result");

    jest.mock("./cli/steps", () => {
      return mockSteps;
    });

    const opt = {
      keyword: "then",
      tag: "header"
    };

    const {Steps} = require("./index");
    expect(Steps(opt)).toEqual("result");
    expect(mockSteps.mock.calls).toHaveLength(1);
    expect(mockSteps.mock.calls[0][0]).toEqual("then");
    expect(mockSteps.mock.calls[0][1]).toEqual({
      config: "./.restqa.yml",
      tag: "header",
      print: false
    });
  });

  describe("# Index - Run", () => {
    let filename;
    beforeEach(() => {
      if (filename && fs.existsSync(filename)) {
        fs.unlinkSync(filename);
        filename = undefined;
      }
    });

    test("Get result from run", async () => {
      let exportStream;
      const mockRun = jest.fn().mockImplementation((options) => {
        // simulate the writting of an file export from cucumber-export module
        options.exportStream.write(Buffer.from(JSON.stringify({foo: "bar"})));
        options.exportStream.end();
        exportStream = options.exportStream;

        return Promise.resolve("result");
      });

      jest.mock("./cli/run", () => {
        return mockRun;
      });

      const stream = new Stream.Writable();

      const opt = {
        configFile: "/tmp/.restqa.yml",
        env: "local",
        stream,
        path: "tests/"
      };

      const {Run} = require("./index");
      await expect(Run(opt)).resolves.toEqual({foo: "bar"});
      expect(mockRun.mock.calls).toHaveLength(1);
      expect(mockRun.mock.calls[0][0]).toEqual({
        config: "/tmp/.restqa.yml",
        env: "local",
        stream,
        tags: [],
        args: ["tests/"],
        exportStream
      });
    });

    test("Get result from run without path", async () => {
      let exportStream;
      const mockRun = jest.fn().mockImplementation((options) => {
        // simulate the writting of an file export from cucumber-export module
        options.exportStream.write(Buffer.from(JSON.stringify({foo: "bar"})));
        options.exportStream.end();
        exportStream = options.exportStream;

        return Promise.resolve("result");
      });

      jest.mock("./cli/run", () => {
        return mockRun;
      });

      const stream = new Stream.Writable();

      const opt = {
        configFile: "/tmp/.restqa.yml",
        env: "local",
        stream
      };

      const {Run} = require("./index");
      await expect(Run(opt)).resolves.toEqual({foo: "bar"});
      expect(mockRun.mock.calls).toHaveLength(1);
      expect(mockRun.mock.calls[0][0]).toEqual({
        config: "/tmp/.restqa.yml",
        env: "local",
        tags: [],
        stream,
        exportStream
      });
    });

    test("throw error if runner has an issue", async () => {
      let exportStream;
      const mockRun = jest.fn().mockImplementation((options) => {
        // simulate the writting of an file export from cucumber-export module
        options.exportStream.write(Buffer.from(JSON.stringify({foo: "bar"})));
        options.exportStream.end();
        exportStream = options.exportStream;

        return Promise.reject(new Error("Issue with the file"));
      });

      jest.mock("./cli/run", () => {
        return mockRun;
      });

      const stream = new Stream.Writable();
      const opt = {
        configFile: "/tmp/.restqa.yml",
        env: "local",
        stream,
        tags: ["@success"]
      };

      const {Run} = require("./index");
      await expect(Run(opt)).rejects.toEqual(new Error("Issue with the file"));
      expect(mockRun.mock.calls).toHaveLength(1);
      expect(mockRun.mock.calls[0][0]).toEqual({
        config: "/tmp/.restqa.yml",
        env: "local",
        stream,
        tags: ["@success"],
        exportStream
      });
    });
  });

  describe.skip("# Index - Dashboard", () => {
    const http = require("http");

    test("Get the http server object", async () => {
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
          url: http://localhost:3000
    outputs:
      - type: file
        enabled: true
        config:
          path: 'my-report.json'
      `;
      const filename = jestqa.createTmpFile(content, ".restqa.yml");

      const opt = {
        configFile: filename
      };

      const {Dashboard} = require("./index");
      const result = Dashboard(opt);
      expect(result.constructor.name).toBe(
        http.createServer().constructor.name
      );
    });
  });
});
