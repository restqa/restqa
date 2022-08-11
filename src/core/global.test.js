const Global = require("./global");
const Config = require("../config");
const {Writable} = require("stream");

const jestqa = new JestQA(__filename, true);

beforeEach(jestqa.beforeEach);
afterEach(jestqa.afterEach);

describe("#Global instance", () => {
  test("Create a new global class base on Local test options", () => {
    const validRestQAConfigFile = `
---

version: 0.0.1
metadata:
  code: API
  name: My test API
  description: The description of the test api
tests:
  local:
    port: 8080
    command: npm run dev
    `;
    const configFile = jestqa.createCwdConfig(validRestQAConfigFile);

    const optionsLocalTest = {
      configFile,
      report: true
    };

    const InstanceGlobal = new Global(optionsLocalTest);
    expect(InstanceGlobal.isLocalTest()).toBeTruthy();
    expect(InstanceGlobal.configFile).toEqual(configFile);
    expect(InstanceGlobal.report).toEqual(true);
    expect(InstanceGlobal.env).toBeUndefined();
    expect(InstanceGlobal.config).toBeInstanceOf(Config);
    expect(InstanceGlobal.config.getLocalTest().getPort()).toEqual(8080);
    expect(InstanceGlobal.config.getLocalTest().getCommand()).toEqual(
      "npm run dev"
    );
    expect(InstanceGlobal.exportStream).toBeUndefined();
    expect(InstanceGlobal.outputStream).toBeInstanceOf(Writable);
  });

  test("Create a new global class base on integration test options", () => {
    const validRestQAConfigFile = `
---

version: 0.0.1
metadata:
  code: API
  name: My test API
  description: The description of the test api
tests:
  integrations:
    - name: 'UAT'
      url: 'https://example.com'
    `;
    const configFile = jestqa.createCwdConfig(validRestQAConfigFile);

    const optionsLocalTest = {
      configFile,
      env: "UAT"
    };

    const InstanceGlobal = new Global(optionsLocalTest);
    expect(InstanceGlobal.isLocalTest()).toBeFalsy();
    expect(InstanceGlobal.configFile).toEqual(configFile);
    expect(InstanceGlobal.report).toEqual(false);
    expect(InstanceGlobal.env).toEqual("UAT");
    expect(InstanceGlobal.config).toBeInstanceOf(Config);
    expect(InstanceGlobal.exportStream).toBeUndefined();
    expect(InstanceGlobal.outputStream).toBeInstanceOf(Writable);
  });
});
