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

describe("#report - MATTERMOST", () => {
  test("Rejected if the config doesn't contain the url", () => {
    const Mattermost = require("./mattermost");
    const config = {};
    const result = {};
    return expect(Mattermost(config, result)).rejects.toThrow(
      new Error('config.url is required for the "mattermost" report')
    );
  });

  test("Resolved if the config only specify notification for failure", async () => {
    const got = require("got");
    jest.mock("got");

    const Mattermost = require("./mattermost");
    const config = {
      url: "http://my-url.test/report",
      onlyFailed: true
    };

    const result = {
      success: true
    };

    await expect(Mattermost(config, result)).resolves.toBe(
      "[MATTERMOST] No notification is required because eveything is fine :)"
    );
    expect(got.mock.calls).toHaveLength(0);
  });

  test("Rejected if an issue occured", () => {
    const Errors = require("../errors");

    const Mattermost = require("./mattermost");
    const config = {
      url: "http://my-url.test/report",
      onlyFailed: false
    };

    testResult.scenarios = null;

    return expect(Mattermost(config, testResult)).rejects.toThrow(
      new Errors.DEFAULT(
        "MATTERMOST REPORT",
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

    const Mattermost = require("./mattermost");
    const config = {
      url: "http://my-url.test/report",
      onlyFailed: false
    };

    await expect(Mattermost(config, testResult)).rejects.toThrow(
      new Errors.HTTP("MATTERMOST REPORT", gotError)
    );

    const MattermostExpect = {
      attachments: [
        {
          author_name: "@restqa",
          author_link: "https://restqa.io",
          author_icon: "https://restqa.io/assets/img/favicon.png",
          title: "The test suite *Passed (10/10)*",
          color: "#007a5a",
          fields: [
            {
              short: true,
              title: "Name",
              value: "my test result"
            },
            {
              short: true,
              title: "Key",
              value: "MY-KEY"
            },
            {
              short: true,
              title: "Environment",
              value: "local"
            },
            {
              short: true,
              title: "Execution Id",
              value: "xxx-yyy-zzz"
            },
            {
              title: "Scenarios",
              value: `* Passed: 50
* Failed: 0
* Skipped: 10
* Undefined: 0`
            }
          ],
          thumb_url: "https://restqa.io/assets/img/utils/restqa-logo-passed.png"
        }
      ]
    };

    const expectedOptions = {
      hostname: "my-url.test",
      port: "",
      protocol: "http:",
      pathname: "/report",
      method: "POST",
      body: JSON.stringify(MattermostExpect)
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

    const Mattermost = require("./mattermost");

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

    await expect(Mattermost(config, testResult)).resolves.toBe(
      "[MATTERMOST REPORT][201] - http://my-url.test/report"
    );

    const MattermostExpect = {
      attachments: [
        {
          author_name: "@restqa",
          author_link: "https://restqa.io",
          author_icon: "https://restqa.io/assets/img/favicon.png",
          title: "The test suite *Failed (9/10)*",
          color: "#ff0000",
          fields: [
            {
              short: true,
              title: "Name",
              value: "my test result"
            },
            {
              short: true,
              title: "Key",
              value: "MY-KEY"
            },
            {
              short: true,
              title: "Environment",
              value: "local"
            },
            {
              short: true,
              title: "Execution Id",
              value: "xxx-yyy-zzz"
            },
            {
              title: "Scenarios",
              value: `* Passed: 49
* Failed: 1
* Skipped: 10
* Undefined: 0`
            },
            {
              title: "📕 Feature: Feature name",
              value: `**Scenario: ** This is scenario name
**Failed Step: ** When i have an issue (Line 45)
${"```"}
Not working
${"```"}`
            },
            {
              title: "",
              value:
                "📊 <http://url-of-the-report/xxx-yyy-zzz|View test report>"
            }
          ],
          thumb_url: "https://restqa.io/assets/img/utils/restqa-logo-failed.png"
        }
      ]
    };

    const expectedOptions = {
      hostname: "my-url.test",
      port: "",
      protocol: "http:",
      pathname: "/report",
      method: "POST",
      body: JSON.stringify(MattermostExpect)
    };
    expect(got.mock.calls).toHaveLength(1);
    expect(got.mock.calls[0][0]).toEqual(expectedOptions);
  });

  test("Fail case with config.displayedErrorsLimit = 1 and 3 fails, Result should show only 1 fail)", async () => {
    const got = require("got");
    jest.mock("got");
    got.mockResolvedValue({
      statusCode: 201,
      body: {
        result: "ok"
      }
    });

    const Mattermost = require("./mattermost");

    const config = {
      url: "http://my-url.test/report",
      onlyFailed: false,
      showErrors: true,
      displayedErrorsLimit: 1,
      reportUrl: "http://url-of-the-report/{uuid}"
    };

    testResult.success = false;
    testResult.passed = 7;
    testResult.failed = 3;
    testResult.scenarios.passed = 47;
    testResult.scenarios.failed = 3;
    testResult.features = [
      {
        feature_name: "Feature name",
        elements: [
          {
            name: "This is scenario name 1",
            steps: [
              {
                keyword: "When",
                name: "i have an issue",
                line: 45,
                result: {
                  status: "failed",
                  error_message: "Not working 1"
                }
              }
            ]
          },
          {
            name: "This is scenario name 2",
            steps: [
              {
                keyword: "When",
                name: "i have an issue 2",
                line: 50,
                result: {
                  status: "failed",
                  error_message: "Not working 2"
                }
              }
            ]
          },
          {
            name: "This is scenario name 3",
            steps: [
              {
                keyword: "When",
                name: "i have an issue 3",
                line: 55,
                result: {
                  status: "failed",
                  error_message: "Not working 3"
                }
              }
            ]
          }
        ]
      }
    ];

    await expect(Mattermost(config, testResult)).resolves.toBe(
      "[MATTERMOST REPORT][201] - http://my-url.test/report"
    );

    const MattermostExpect = {
      attachments: [
        {
          author_name: "@restqa",
          author_link: "https://restqa.io",
          author_icon: "https://restqa.io/assets/img/favicon.png",
          title: "The test suite *Failed (7/10)*",
          color: "#ff0000",
          fields: [
            {
              short: true,
              title: "Name",
              value: "my test result"
            },
            {
              short: true,
              title: "Key",
              value: "MY-KEY"
            },
            {
              short: true,
              title: "Environment",
              value: "local"
            },
            {
              short: true,
              title: "Execution Id",
              value: "xxx-yyy-zzz"
            },
            {
              title: "Scenarios",
              value: `* Passed: 47
* Failed: 3
* Skipped: 10
* Undefined: 0`
            },
            {
              title: "📕 Feature: Feature name",
              value: `**Scenario: ** This is scenario name 1
**Failed Step: ** When i have an issue (Line 45)
${"```"}
Not working 1
${"```"}`
            },
            {
              title: "",
              value: "*2 hidden errors*"
            },
            {
              title: "",
              value:
                "📊 <http://url-of-the-report/xxx-yyy-zzz|View test report>"
            }
          ],
          thumb_url: "https://restqa.io/assets/img/utils/restqa-logo-failed.png"
        }
      ]
    };

    const expectedOptions = {
      hostname: "my-url.test",
      port: "",
      protocol: "http:",
      pathname: "/report",
      method: "POST",
      body: JSON.stringify(MattermostExpect)
    };
    expect(got.mock.calls).toHaveLength(1);
    expect(got.mock.calls[0][0]).toEqual(expectedOptions);
  });
});
