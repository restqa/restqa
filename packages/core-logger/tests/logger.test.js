beforeEach(() => {
  global.console.info = jest.fn();
});

afterEach(() => {
  jest.resetModules();
});

const chalk = require("chalk");

describe("Logger", () => {
  test("log log", () => {
    const {Logger} = require("../src/index");
    Logger.log("my msg %s %s", "msg2", "msg3");
    expect(global.console.info.mock.calls).toHaveLength(1);
    expect(global.console.info.mock.calls[0][0]).toEqual("my msg msg2 msg3");
  });

  describe("log error", () => {
    test("log when the value is not found into the locale  file", () => {
      const {Logger} = require("../src/index");
      Logger.error("my error msg", "msg2");
      expect(global.console.info.mock.calls).toHaveLength(1);
      expect(global.console.info.mock.calls[0][0]).toEqual(
        chalk.bold.red("my error msg") + " msg2"
      );
    });

    test("log when the value is coming from then locale file", () => {
      const {Logger} = require("../src/index");
      Logger.error("service.init.success.welcome");
      expect(global.console.info.mock.calls).toHaveLength(1);
      expect(global.console.info.mock.calls[0][0]).toEqual(
        chalk.bold.red(
          "You have successfully installed RestQA! Let’s begin your test automation with RestQA 💥🚀"
        )
      );
    });

    test("log raw error if the pass parameter is an error Object", () => {
      const {Logger} = require("../src/index");
      Logger.error(new Error("custom error"));
      expect(global.console.info.mock.calls).toHaveLength(1);
      expect(global.console.info.mock.calls[0][0]).toEqual(
        chalk.bold.red("Error: custom error")
      );
    });

    test("log value with placeholder", () => {
      const {Logger} = require("../src/index");
      Logger.error("my error from %s", "unit test");
      expect(global.console.info.mock.calls).toHaveLength(1);
      expect(global.console.info.mock.calls[0][0]).toEqual(
        chalk.bold.red("my error from unit test")
      );
    });
  });

  describe("log info", () => {
    test("log the passing string if the value is not found into the locale file", () => {
      const {Logger} = require("../src/index");
      Logger.info("my info msg", "msg2");
      expect(global.console.info.mock.calls).toHaveLength(1);
      expect(global.console.info.mock.calls[0][0]).toEqual(
        chalk.bold.blue("my info msg") + " msg2"
      );
    });

    test("Log the information coming from the locale file", () => {
      const {Logger} = require("../src/index");
      Logger.info("service.select_environment", "foo.bar");
      expect(global.console.info.mock.calls).toHaveLength(1);
      expect(global.console.info.mock.calls[0][0]).toEqual(
        chalk.bold.blue('🎯 The selected environment is: "foo.bar"')
      );
    });
  });

  describe("log success", () => {
    test("log the passing string if the value is not found into the locale file", () => {
      const {Logger} = require("../src/index");
      Logger.success("my success msg", "msg2");
      expect(global.console.info.mock.calls).toHaveLength(1);
      expect(global.console.info.mock.calls[0][0]).toEqual(
        chalk.bold.green("my success msg") + " msg2"
      );
    });

    test("Log the information coming from the locale file", () => {
      const {Logger} = require("../src/index");
      Logger.success("service.select_environment", "foo.bar");
      expect(global.console.info.mock.calls).toHaveLength(1);
      expect(global.console.info.mock.calls[0][0]).toEqual(
        chalk.bold.green('🎯 The selected environment is: "foo.bar"')
      );
    });
  });

  describe("log warning", () => {
    test("log the passing string if the value is not found into the locale file", () => {
      const {Logger} = require("../src/index");
      Logger.warning("my success msg", "msg2");
      expect(global.console.info.mock.calls).toHaveLength(1);
      expect(global.console.info.mock.calls[0][0]).toEqual(
        chalk.bold.yellow("my success msg") + " msg2"
      );
    });

    test("Log the information coming from the locale file", () => {
      const {Logger} = require("../src/index");
      Logger.warning("service.select_environment", "foo.bar");
      expect(global.console.info.mock.calls).toHaveLength(1);
      expect(global.console.info.mock.calls[0][0]).toEqual(
        chalk.bold.yellow('🎯 The selected environment is: "foo.bar"')
      );
    });
  });
});

const {Locale} = require("../src/index");

describe("#locale", () => {
  test("get the value from a nested object", () => {
    const result = Locale().service.init.success.welcome;
    expect(result).toBe(
      "You have successfully installed RestQA! Let’s begin your test automation with RestQA 💥🚀"
    );
  });

  test("get the value from a nested object using a prefix", () => {
    const result = Locale("service.init").success.welcome;
    expect(result).toBe(
      "You have successfully installed RestQA! Let’s begin your test automation with RestQA 💥🚀"
    );
  });

  test("get the value from a nested object only with a prefix", () => {
    const result = Locale("service.init.success.welcome");
    expect(result).toBe(
      "You have successfully installed RestQA! Let’s begin your test automation with RestQA 💥🚀"
    );
  });
});
