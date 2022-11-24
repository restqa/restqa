let testResult = {};

beforeEach(() => {
  jest.resetModules();
  testResult = {
    id: "xxx-yyy-zzz",
    name: "my test result",
    env: "local",
    key: "MY-KEY",
    success: true,
    total: 10,
    passed: 10,
    failed: 0,
    scenarios: {
      passed: 50,
      failed: 0,
      skipped: 10,
      undefined: 0
    }
  };
});

describe("#report - LINE", () => {
  test("Rejected if the config doesn't contain the token", () => {
    const Line = require("./line");
    const config = {};
    const result = {};
    return expect(Line(config, result)).rejects.toThrow(
      new Error('config.token is required for the "line" report')
    );
  });

  test("Resolved if the config only specify notification for failure", async () => {
    const got = require("got");
    jest.mock("got");

    const Line = require("./line");
    const config = {
      token: "test",
      onlyFailed: true
    };

    const result = {
      success: true
    };

    await expect(Line(config, result)).resolves.toBe(
      "[LINE] No Notification is required because eveything is fine :)"
    );
    expect(got.mock.calls).toHaveLength(0);
  });

  test("Rejected if an issue occured", () => {
    const Errors = require("../errors");

    const Line = require("./line");
    const config = {
      token: "test",
      onlyFailed: false
    };

    testResult.scenarios = null;

    return expect(Line(config, testResult)).rejects.toThrow(
      new Errors.DEFAULT(
        "LINE REPORT",
        new Error("Cannot read properties of null (reading 'passed')")
      )
    );
  });

  test("Rejected if the request fail", async () => {
    const Errors = require("../errors");
    const got = require("got");
    jest.mock("got");
    const gotError = new Error("got Msg");
    gotError.response = {
      statusCode: 503,
      body: {
        err: "foo/bar"
      }
    };

    got.mockRejectedValue(gotError);

    const Line = require("./line");
    const config = {
      token: "test",
      onlyFailed: false
    };

    await expect(Line(config, testResult)).rejects.toThrow(
      new Errors.HTTP("LINE REPORT", gotError)
    );

    const lineExpect = {
      message: [
        "The test suite Passed (10/10)",
        "Name: my test result",
        "key: MY-KEY",
        "Environment: local",
        "Execution Id : xxx-yyy-zzz",
        "Scenarios:",
        "  * ✅ Passed: 50",
        "  * ❌ Failed: 0",
        "  * ⚠️ Skipped: 10",
        "  * ⁉️ Undefined: 0"
      ].join("\n"),
      imageThumbnail:
        "https://restqa.io/assets/img/utils/restqa-logo-passed.png",
      imageFullsize:
        "https://restqa.io/assets/img/utils/restqa-logo-passed.png",
      notificationDisabled: false
    };

    const expectedOptions = {
      hostname: "notify-api.line.me",
      port: "",
      protocol: "https:",
      pathname: "/api/notify",
      method: "POST",
      form: lineExpect,
      headers: {
        authorization: "Bearer test"
      }
    };
    expect(got.mock.calls).toHaveLength(1);
    expect(got.mock.calls[0][0]).toEqual(expectedOptions);
  });

  test("Success case with  report link)", async () => {
    const got = require("got");
    jest.mock("got");
    got.mockResolvedValue({
      statusCode: 201,
      body: {
        result: "ok"
      }
    });

    const Line = require("./line");
    const config = {
      token: "test",
      onlyFailed: false,
      reportUrl: "http://url-of-the-report/{uuid}"
    };

    testResult.success = false;
    testResult.passed = 9;
    testResult.failed = 1;
    testResult.scenarios.passed = 49;
    testResult.scenarios.failed = 1;

    await expect(Line(config, testResult)).resolves.toBe(
      "[LINE REPORT][201] - Notification sent!"
    );

    const lineExpect = {
      message: [
        "The test suite Failed (9/10)",
        "Name: my test result",
        "key: MY-KEY",
        "Environment: local",
        "Execution Id : xxx-yyy-zzz",
        "Scenarios:",
        "  * ✅ Passed: 49",
        "  * ❌ Failed: 1",
        "  * ⚠️ Skipped: 10",
        "  * ⁉️ Undefined: 0",
        "📊  http://url-of-the-report/xxx-yyy-zzz"
      ].join("\n"),
      imageThumbnail:
        "https://restqa.io/assets/img/utils/restqa-logo-failed.png",
      imageFullsize:
        "https://restqa.io/assets/img/utils/restqa-logo-failed.png",
      notificationDisabled: false
    };

    const expectedOptions = {
      hostname: "notify-api.line.me",
      port: "",
      protocol: "https:",
      pathname: "/api/notify",
      method: "POST",
      form: lineExpect,
      headers: {
        authorization: "Bearer test"
      }
    };
    expect(got.mock.calls).toHaveLength(1);
    expect(got.mock.calls[0][0]).toEqual(expectedOptions);
  });
});
