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

describe("#report - DISCORD", () => {
  test("Rejected if the config doesn't contain the url", () => {
    const Discord = require("./discord");
    const config = {};
    const result = {};
    return expect(Discord(config, result)).rejects.toThrow(
      new Error('config.url is required for the "discord" report')
    );
  });

  test("Resolved if the config only specify notification for failure", () => {
    const got = require("got");
    jest.mock("got");

    const Discord = require("./discord");
    const config = {
      url: "http://my-url.test/report",
      onlyFailed: true
    };

    const result = {
      success: true
    };

    expect(got.mock.calls).toHaveLength(0);
    return expect(Discord(config, result)).resolves.toBe(
      "[DISCORD] No notification is required because eveything is fine :)"
    );
  });

  test("Discord if an issue occured", () => {
    const Errors = require("../errors");

    const Discord = require("./discord");
    const config = {
      url: "http://my-url.test/report",
      onlyFailed: false
    };

    testResult.scenarios = null;

    return expect(Discord(config, testResult)).rejects.toThrow(
      new Errors.DEFAULT(
        "DISCORD REPORT",
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

    const Discord = require("./discord");
    const config = {
      url: "http://my-url.test/report",
      onlyFailed: false
    };

    await expect(Discord(config, testResult)).rejects.toThrow(
      new Errors.HTTP("DISCORD REPORT", gotError)
    );

    const discordExpect = {
      username: null,
      tts: false,
      embeds: [
        {
          title: "The test suite **passed (10/10)**",
          description: `**Name:** my test result
**Key:** MY-KEY
**Environment:** local
**Execution Id:** xxx-yyy-zzz

**Scenarios:**
- **Passed:** 50
- **Failed:** 0
- **Skipped:** 10
- **Undefined:** 0

*Powered By:* [@restqa](https://restqa.io)`,
          thumbnail: {
            url: "https://restqa.io/assets/img/utils/restqa-logo-passed.png"
          },
          color: 31322
        }
      ]
    };

    const expectedOptions = {
      hostname: "my-url.test",
      port: "",
      protocol: "http:",
      pathname: "/report",
      method: "POST",
      body: JSON.stringify(discordExpect),
      headers: {
        "Content-Type": "application/json"
      }
    };

    expect(got.mock.calls).toHaveLength(1);
    expect(got.mock.calls[0][0]).toEqual(expectedOptions);
  });

  test("Success case with config.showError = true, and report link)", async () => {
    const got = require("got");
    jest.mock("got");
    got.mockResolvedValue({
      statusCode: 201,
      body: {
        result: "ok"
      }
    });

    const Discord = require("./discord");

    const config = {
      url: "http://my-url.test/report",
      onlyFailed: false,
      showErrors: true,
      reportUrl: "http://url-of-the-report/{uuid}"
    };

    testResult.success = false;
    testResult.passed = 9;
    testResult.failed = 1;
    testResult.scenarios.passed = 49;
    testResult.scenarios.failed = 1;
    testResult.features = [
      {
        feature_name: "Feature name",
        elements: [
          {
            name: "This is scenario name",
            steps: [
              {
                keyword: "When",
                name: "i have an issue",
                line: 45,
                result: {
                  status: "failed",
                  error_message: "Not working"
                }
              }
            ]
          }
        ]
      }
    ];

    await expect(Discord(config, testResult)).resolves.toBe(
      "[DISCORD REPORT][201] - http://my-url.test/report"
    );

    const discordExpect = {
      username: null,
      tts: false,
      embeds: [
        {
          title: "The test suite **failed (9/10)**",
          description: `[**📊 View test report**](http://url-of-the-report/xxx-yyy-zzz)
**Name:** my test result
**Key:** MY-KEY
**Environment:** local
**Execution Id:** xxx-yyy-zzz

**Scenarios:**
- **Passed:** 49
- **Failed:** 1
- **Skipped:** 10
- **Undefined:** 0

*Powered By:* [@restqa](https://restqa.io)`,
          thumbnail: {
            url: "https://restqa.io/assets/img/utils/restqa-logo-failed.png"
          },
          color: 16711680,
          fields: [
            {
              name: "📕 **Feature**: Feature name",
              value: `**Scenario**: This is scenario name
**Failed step**: When i have an issue (Line 45)
${"```"} Not working ${"```"}
----`
            }
          ],
          url: "http://url-of-the-report/xxx-yyy-zzz"
        }
      ]
    };

    const expectedOptions = {
      hostname: "my-url.test",
      port: "",
      protocol: "http:",
      pathname: "/report",
      method: "POST",
      body: JSON.stringify(discordExpect),
      headers: {
        "Content-Type": "application/json"
      }
    };
    expect(got.mock.calls).toHaveLength(1);
    expect(got.mock.calls[0][0]).toEqual(expectedOptions);
  });
});
