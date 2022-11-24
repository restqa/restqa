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

describe("#report - MICROSOFT TEAMS", () => {
  test("Rejected if the config doesn't contain the url", () => {
    const Teams = require("./microsoft-teams");
    const config = {};
    const result = {};
    return expect(Teams(config, result)).rejects.toThrow(
      new Error('config.url is required for the "microsoft-teams" report')
    );
  });

  test("Resolved if the config only specify notification for failure", () => {
    const got = require("got");
    jest.mock("got");

    const Teams = require("./microsoft-teams");
    const config = {
      url: "http://my-url.test/report",
      onlyFailed: true
    };

    const result = {
      success: true
    };

    expect(got.mock.calls).toHaveLength(0);
    return expect(Teams(config, result)).resolves.toBe(
      "[MICROSOFT TEAMS] No notification is required because eveything is fine :)"
    );
  });

  test("Rejected if an issue occured", () => {
    const Errors = require("../errors");

    const Teams = require("./microsoft-teams");
    const config = {
      url: "http://my-url.test/report",
      onlyFailed: false
    };

    testResult.scenarios = null;

    return expect(Teams(config, testResult)).rejects.toThrow(
      new Errors.DEFAULT(
        "MICROSOFT TEAMS REPORT",
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

    const Teams = require("./microsoft-teams");
    const config = {
      url: "http://my-url.test/report",
      onlyFailed: false
    };

    await expect(Teams(config, testResult)).rejects.toThrow(
      new Errors.HTTP("MICROSOFT TEAMS REPORT", gotError)
    );

    const teamsExpect = {
      "@type": "MessageCard",
      "@context": "http://schema.org/extensions",
      themeColor: "007a5a",
      summary: "my test result passed",
      title: 'Test suite "my test result" results',
      text: "The test suite **passed (10/10)**",
      sections: [
        {
          activityTitle: "Details",
          activitySubtitle:
            "*Powered By:* [@restqa](https://restqa.io|@restqa)",
          activityImage:
            "https://restqa.io/assets/img/utils/restqa-logo-passed.png",
          activityText:
            "Name: my test result\n\nEnvironment: local\n\n" +
            "Key: MY-KEY\n\nExecution Id: xxx-yyy-zzz\n\n",
          facts: [
            {
              name: "Scenarios",
              value: ""
            },
            {
              name: "• Passed",
              value: "50"
            },
            {
              name: "• Failed",
              value: "0"
            },
            {
              name: "• Skipped",
              value: "10"
            },
            {
              name: "• Undefined",
              value: "0"
            }
          ],
          markdown: true
        }
      ],
      potentialAction: []
    };

    const expectedOptions = {
      hostname: "my-url.test",
      port: "",
      protocol: "http:",
      pathname: "/report",
      method: "POST",
      body: JSON.stringify(teamsExpect)
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

    const Teams = require("./microsoft-teams");

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

    await expect(Teams(config, testResult)).resolves.toBe(
      "[MICROSOFT TEAMS REPORT][201] - http://my-url.test/report"
    );

    const teamsExpect = {
      "@type": "MessageCard",
      "@context": "http://schema.org/extensions",
      themeColor: "ff0000",
      summary: "my test result failed",
      title: 'Test suite "my test result" results',
      text: "The test suite **failed (9/10)**",
      sections: [
        {
          activityTitle: "Details",
          activitySubtitle:
            "*Powered By:* [@restqa](https://restqa.io|@restqa)",
          activityImage:
            "https://restqa.io/assets/img/utils/restqa-logo-failed.png",
          activityText:
            "Name: my test result\n\nEnvironment: local\n\nKey: MY-KEY\n\nExecution Id: xxx-yyy-zzz\n\n",
          facts: [
            {
              name: "Scenarios",
              value: ""
            },
            {
              name: "• Passed",
              value: "49"
            },
            {
              name: "• Failed",
              value: "1"
            },
            {
              name: "• Skipped",
              value: "10"
            },
            {
              name: "• Undefined",
              value: "0"
            }
          ],
          markdown: true
        },
        {
          activityTitle: "📕 *Feature*: Feature name",
          facts: [
            {
              name: "Scenario",
              value: "This is scenario name"
            },
            {
              name: "Failed step",
              value: "When i have an issue (Line 45)"
            },
            {
              name: "Error message",
              value: "\n\n    Not working"
            }
          ],
          markdown: true
        }
      ],
      potentialAction: [
        {
          "@type": "OpenUri",
          name: "📊 View test report",
          targets: [
            {
              os: "default",
              uri: "http://url-of-the-report/xxx-yyy-zzz"
            }
          ]
        }
      ]
    };

    const expectedOptions = {
      hostname: "my-url.test",
      port: "",
      protocol: "http:",
      pathname: "/report",
      method: "POST",
      body: JSON.stringify(teamsExpect)
    };
    expect(got.mock.calls).toHaveLength(1);
    expect(got.mock.calls[0][0]).toEqual(expectedOptions);
  });
});
