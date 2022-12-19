const path = require("path");
const os = require("os");

const jestqa = new JestQA(__filename, true);

beforeEach(jestqa.beforeEach);
afterEach(jestqa.afterEach);

const Telemetry = require("./telemetry");

describe("#Cli - Steps", () => {
  beforeEach(() => {
    const filename = path.resolve(os.homedir(), ".config", "restqa.pref");
    jestqa.getCurrent().files.push(filename);
  });

  test("Throw an error if the status is no an available choice", () => {
    expect(() => {
      Telemetry("try");
    }).toThrow("The status is incorrect. Available: on | off");
  });

  test("Enable the telemetry", () => {
    Telemetry("on");

    expect(jestqa.getLoggerMock()).toHaveBeenCalledTimes(2);
    expect(jestqa.getLoggerMock().mock.calls[0][0]).toMatch(
      "🕵️ The telemetry has been enabled."
    );
    expect(jestqa.getLoggerMock().mock.calls[1][0]).toMatch(
      "More detail on https://dashboard.restqa.io/#/documentation/telemetry"
    );
  });

  test("Enable the telemetry Uppercase", () => {
    Telemetry("ON");

    expect(jestqa.getLoggerMock()).toHaveBeenCalledTimes(2);
    expect(jestqa.getLoggerMock().mock.calls[0][0]).toMatch(
      "🕵️ The telemetry has been enabled."
    );
    expect(jestqa.getLoggerMock().mock.calls[1][0]).toMatch(
      "More detail on https://dashboard.restqa.io/#/documentation/telemetry"
    );
  });

  test("Disable the telemetry Uppercase", () => {
    Telemetry("Off");

    expect(jestqa.getLoggerMock()).toHaveBeenCalledTimes(2);
    expect(jestqa.getLoggerMock().mock.calls[0][0]).toMatch(
      "🕵️ The telemetry has been disabled."
    );
    expect(jestqa.getLoggerMock().mock.calls[1][0]).toMatch(
      "More detail on https://dashboard.restqa.io/#/documentation/telemetry"
    );
  });
});
