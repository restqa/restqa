const {Writable} = require("stream");
const Global = require("../core/global");
const {EventEmitter} = require("events");
const Message = require("@cucumber/messages");
const chalk = require("chalk");

const jestqa = new JestQA(__filename, true);

beforeEach(jestqa.beforeEach);
afterEach(jestqa.afterEach);

jestqa.hooks.beforeEach = function () {
  delete global.restqa;
};

describe("unit-test-formatter", () => {
  function getTestCaseAttemptMock(feature, scenario, status) {
    const envelope = new Message.Envelope();
    envelope.gherkinDocument = new Message.GherkinDocument();
    envelope.gherkinDocument.feature = new Message.Feature();
    envelope.gherkinDocument.feature.name = feature;
    envelope.pickle = new Message.Pickle();
    envelope.pickle.name = scenario;
    envelope.worstTestStepResult = {
      status
    };
    return envelope;
  }

  function triggerEvent(emitter, uuid, debugLogs = []) {
    const envelopeTestCaseStarted = new Message.Envelope();
    envelopeTestCaseStarted.testCaseStarted = new Message.TestCaseStarted();
    envelopeTestCaseStarted.testCaseStarted.id = uuid;
    emitter.emit("envelope", envelopeTestCaseStarted);

    if (debugLogs.length) {
      debugLogs.forEach((str) => global.restqa.outputStream.addDebugLog(str));
    }

    const envelopeTestCaseFinished = new Message.Envelope();
    envelopeTestCaseFinished.testCaseFinished = new Message.TestCaseFinished();
    envelopeTestCaseFinished.testCaseFinished.testCaseStartedId = uuid;
    emitter.emit("envelope", envelopeTestCaseFinished);
  }

  function mockGetErrorStep() {
    return {
      attachments: [],
      keyword: "Then ",
      result: {
        duration: {seconds: 0, nanos: 1000000},
        status: "FAILED",
        message:
          "AssertionError [ERR_ASSERTION]: [GET /] The response httpCode is invalid, received 200 should be 201\n" +
          "    + expected - actual\n" +
          "\n" +
          "    -200\n" +
          "    +201\n" +
          "\n" +
          "    at Object.Then.httpCode (/Users/olivierodo/WORKS/restqa/restqa/node_modules/@restqa/restqapi/src/restqapi/steps/3-then/functions.js:26:10)",
        willBeRetried: false
      },
      actionLocation: {
        uri: "../node_modules/@restqa/restqapi/node_modules/@restqa/plugin/index.js",
        line: 189
      },
      sourceLocation: {
        uri: "./tests/init-test/tests/integration/welcome-restqa.feature",
        line: 21
      },
      text: "I should receive a response with the status 201"
    };
  }

  test("Printing a passing test scenario into the stdout", () => {
    return new Promise((resolve, reject) => {
      let result = "";
      const stdout = new Writable({
        write: (chunk, encoding, cb) => {
          result += chunk.toString();
          cb();
        }
      });

      const options = {
        outputStream: new Global.Output({stdout})
      };
      options.outputStream.on("close", () => {
        const expected = `
✅ ${chalk.green.bold("PASSED")} - As a User I want to login > Wrong Password
---
${chalk.green("1 passed")}, 1 total
---
`;
        expect(result).toEqual(expected.trimStart());
        resolve();
      });
      global.restqa = new Global(options);

      jest.mock("@cucumber/cucumber", () => {
        const originalModule = jest.requireActual("@cucumber/cucumber");
        return {
          ...originalModule,
          formatterHelpers: {
            parseTestCaseAttempt: ({testCaseAttempt}) => {
              return {
                testSteps: []
              };
            }
          }
        };
      });

      const UnitTestFormatter = require("./unit-test-formatter");
      const opt = {
        eventBroadcaster: new EventEmitter(),
        eventDataCollector: {
          getTestCaseAttempt: jest
            .fn()
            .mockReturnValue(
              getTestCaseAttemptMock(
                "As a User I want to login",
                "Wrong Password",
                "PASSED"
              )
            )
        }
      };

      const formatter = new UnitTestFormatter(opt); // eslint-disable-line
      const uuid = Message.IdGenerator.uuid()();
      triggerEvent(opt.eventBroadcaster, uuid);

      const envelopeTestRunFinished = new Message.Envelope();
      envelopeTestRunFinished.testRunFinished = new Message.TestRunFinished();
      envelopeTestRunFinished.testRunFinished.success = true;
      opt.eventBroadcaster.emit("envelope", envelopeTestRunFinished);
    });
  });

  test("Printing 1 failing test  and 1 passing scenario into the stdout", () => {
    return new Promise((resolve, reject) => {
      let result = "";
      const stdout = new Writable({
        write: (chunk, encoding, cb) => {
          result += chunk.toString();
          cb();
        }
      });

      const options = {
        outputStream: new Global.Output({stdout})
      };
      options.outputStream.on("close", () => {
        const expected = `
✅ ${chalk.green.bold("PASSED")} - As a User I want to login > Wrong Password
❌ ${chalk.red.bold("FAILED")} - As a User I want to login > Reset Password
${chalk.red(`    AssertionError [ERR_ASSERTION]: [GET /] The response httpCode is invalid, received 200 should be 201
    + expected - actual

    -200
    +201

    at ./tests/init-test/tests/integration/welcome-restqa.feature:21
`)}---
${chalk.red("1 failed")}, ${chalk.green("1 passed")}, 2 total
---
`;
        expect(result).toEqual(expected.trimStart());
        resolve();
      });

      global.restqa = new Global(options);

      const uuid1 = Message.IdGenerator.uuid()();
      const uuid2 = Message.IdGenerator.uuid()();

      jest.mock("@cucumber/cucumber", () => {
        const originalModule = jest.requireActual("@cucumber/cucumber");
        return {
          ...originalModule,
          formatterHelpers: {
            parseTestCaseAttempt: ({testCaseAttempt}) => {
              const testSteps = [];
              if (testCaseAttempt.pickle.name === "Reset Password") {
                testSteps.push(mockGetErrorStep());
              }
              return {
                testSteps
              };
            }
          }
        };
      });

      const UnitTestFormatter = require("./unit-test-formatter");
      const opt = {
        eventBroadcaster: new EventEmitter(),
        eventDataCollector: {
          getTestCaseAttempt: jest
            .fn()
            .mockReturnValueOnce(
              getTestCaseAttemptMock(
                "As a User I want to login",
                "Wrong Password",
                "PASSED"
              )
            )
            .mockReturnValueOnce(
              getTestCaseAttemptMock(
                "As a User I want to login",
                "Wrong Password",
                "PASSED"
              )
            )
            .mockReturnValue(
              getTestCaseAttemptMock(
                "As a User I want to login",
                "Reset Password",
                "FAILED"
              )
            )
        }
      };

      const formatter = new UnitTestFormatter(opt); // eslint-disable-line

      triggerEvent(opt.eventBroadcaster, uuid1);
      triggerEvent(opt.eventBroadcaster, uuid2);

      const envelopeTestRunFinished = new Message.Envelope();
      envelopeTestRunFinished.testRunFinished = new Message.TestRunFinished();
      envelopeTestRunFinished.testRunFinished.success = false;
      opt.eventBroadcaster.emit("envelope", envelopeTestRunFinished);
    });
  });

  test("Printing 1 failing test, 1 skipped and 1 passing scenario into the stdout (with microservice logs)", () => {
    return new Promise((resolve, reject) => {
      let result = "";
      const stdout = new Writable({
        write: (chunk, encoding, cb) => {
          result += chunk.toString();
          cb();
        }
      });

      const options = {
        outputStream: new Global.Output({stdout})
      };
      options.outputStream.on("close", () => {
        const expected = `
✅ ${chalk.green.bold("PASSED")} - As a User I want to login > Wrong Password
  |> DEBUG: log
    --
    Server up
    --
    {
      "foo": "bar"
    }
❌ ${chalk.red.bold("FAILED")} - As a User I want to login > Reset Password
  |> DEBUG: log
    --
    Server up
    --
    {
      "hello": "world"
    }
${chalk.red(`    AssertionError [ERR_ASSERTION]: [GET /] The response httpCode is invalid, received 200 should be 201
    + expected - actual

    -200
    +201

    at ./tests/init-test/tests/integration/welcome-restqa.feature:21
`)}🚧 ${chalk.yellow.bold(
          "SKIPPED"
        )} - As a User I want to login > Generate Password
---
${chalk.red("1 failed")}, ${chalk.yellow("1 skipped")}, ${chalk.green(
          "1 passed"
        )}, 3 total
---
`;
        expect(result).toEqual(expected.trimStart());
        resolve();
      });

      global.restqa = new Global(options);

      const uuid1 = Message.IdGenerator.uuid()();
      const uuid2 = Message.IdGenerator.uuid()();

      jest.mock("@cucumber/cucumber", () => {
        const originalModule = jest.requireActual("@cucumber/cucumber");
        return {
          ...originalModule,
          formatterHelpers: {
            parseTestCaseAttempt: ({testCaseAttempt}) => {
              const testSteps = [];
              if (testCaseAttempt.pickle.name === "Reset Password") {
                testSteps.push(mockGetErrorStep());
              }
              return {
                testSteps
              };
            }
          }
        };
      });

      const UnitTestFormatter = require("./unit-test-formatter");
      const opt = {
        eventBroadcaster: new EventEmitter(),
        eventDataCollector: {
          getTestCaseAttempt: jest
            .fn()
            .mockReturnValueOnce(
              getTestCaseAttemptMock(
                "As a User I want to login",
                "Wrong Password",
                "PASSED"
              )
            )
            .mockReturnValueOnce(
              getTestCaseAttemptMock(
                "As a User I want to login",
                "Wrong Password",
                "PASSED"
              )
            )
            .mockReturnValueOnce(
              getTestCaseAttemptMock(
                "As a User I want to login",
                "Reset Password",
                "FAILED"
              )
            )
            .mockReturnValueOnce(
              getTestCaseAttemptMock(
                "As a User I want to login",
                "Reset Password",
                "FAILED"
              )
            )
            .mockReturnValue(
              getTestCaseAttemptMock(
                "As a User I want to login",
                "Generate Password",
                "SKIPPED"
              )
            )
        }
      };

      const formatter = new UnitTestFormatter(opt); // eslint-disable-line
      const logs1 = ["Server up", '{\n  "foo": "bar"\n}'];
      triggerEvent(opt.eventBroadcaster, uuid1, logs1);

      const logs2 = ["Server up", '{\n  "hello": "world"\n}'];
      triggerEvent(opt.eventBroadcaster, uuid2, logs2);

      const uuid3 = Message.IdGenerator.uuid()();
      triggerEvent(opt.eventBroadcaster, uuid3);

      const envelopeTestRunFinished = new Message.Envelope();
      envelopeTestRunFinished.testRunFinished = new Message.TestRunFinished();
      envelopeTestRunFinished.testRunFinished.success = false;
      opt.eventBroadcaster.emit("envelope", envelopeTestRunFinished);
    });
  });

  test("[SILENT MODE] Printing 1 failing test, 1 skipped and 1 passing scenario into the stdout (with microservice logs)", () => {
    return new Promise((resolve, reject) => {
      let result = "";
      const stdout = new Writable({
        write: (chunk, encoding, cb) => {
          result += chunk.toString();
          cb();
        }
      });

      const silent = true;
      const options = {
        outputStream: new Global.Output({stdout, silent})
      };
      options.outputStream.on("close", () => {
        const expected = `
✅ ${chalk.green.bold("PASSED")} - As a User I want to login > Wrong Password
❌ ${chalk.red.bold("FAILED")} - As a User I want to login > Reset Password
${chalk.red(`    AssertionError [ERR_ASSERTION]: [GET /] The response httpCode is invalid, received 200 should be 201
    + expected - actual

    -200
    +201

    at ./tests/init-test/tests/integration/welcome-restqa.feature:21
`)}🚧 ${chalk.yellow.bold(
          "SKIPPED"
        )} - As a User I want to login > Generate Password
---
${chalk.red("1 failed")}, ${chalk.yellow("1 skipped")}, ${chalk.green(
          "1 passed"
        )}, 3 total
---
`;
        expect(result).toEqual(expected.trimStart());
        resolve();
      });

      global.restqa = new Global(options);

      const uuid1 = Message.IdGenerator.uuid()();
      const uuid2 = Message.IdGenerator.uuid()();

      jest.mock("@cucumber/cucumber", () => {
        const originalModule = jest.requireActual("@cucumber/cucumber");
        return {
          ...originalModule,
          formatterHelpers: {
            parseTestCaseAttempt: ({testCaseAttempt}) => {
              const testSteps = [];
              if (testCaseAttempt.pickle.name === "Reset Password") {
                testSteps.push(mockGetErrorStep());
              }
              return {
                testSteps
              };
            }
          }
        };
      });

      const UnitTestFormatter = require("./unit-test-formatter");
      const opt = {
        eventBroadcaster: new EventEmitter(),
        eventDataCollector: {
          getTestCaseAttempt: jest
            .fn()
            .mockReturnValueOnce(
              getTestCaseAttemptMock(
                "As a User I want to login",
                "Wrong Password",
                "PASSED"
              )
            )
            .mockReturnValueOnce(
              getTestCaseAttemptMock(
                "As a User I want to login",
                "Wrong Password",
                "PASSED"
              )
            )
            .mockReturnValueOnce(
              getTestCaseAttemptMock(
                "As a User I want to login",
                "Reset Password",
                "FAILED"
              )
            )
            .mockReturnValueOnce(
              getTestCaseAttemptMock(
                "As a User I want to login",
                "Reset Password",
                "FAILED"
              )
            )
            .mockReturnValue(
              getTestCaseAttemptMock(
                "As a User I want to login",
                "Generate Password",
                "SKIPPED"
              )
            )
        }
      };

      const formatter = new UnitTestFormatter(opt); // eslint-disable-line
      const logs1 = ["Server up", '{\n  "foo": "bar"\n}'];
      triggerEvent(opt.eventBroadcaster, uuid1, logs1);

      const logs2 = ["Server up", '{\n  "hello": "world"\n}'];
      triggerEvent(opt.eventBroadcaster, uuid2, logs2);

      const uuid3 = Message.IdGenerator.uuid()();
      triggerEvent(opt.eventBroadcaster, uuid3);

      const envelopeTestRunFinished = new Message.Envelope();
      envelopeTestRunFinished.testRunFinished = new Message.TestRunFinished();
      envelopeTestRunFinished.testRunFinished.success = false;
      opt.eventBroadcaster.emit("envelope", envelopeTestRunFinished);
    });
  });
});
