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

describe("#report - SLACK", () => {
  test("Rejected if the config doesn't contain the url", () => {
    const Slack = require("./slack");
    const config = {};
    const result = {};
    return expect(Slack(config, result)).rejects.toThrow(
      new Error('config.url is required for the "slack" report')
    );
  });

  test("Resolved if the config only specify notification for failure", () => {
    const got = require("got");
    jest.mock("got");

    const Slack = require("./slack");
    const config = {
      url: "http://my-url.test/report",
      onlyFailed: true
    };

    const result = {
      success: true
    };

    expect(got.mock.calls).toHaveLength(0);
    return expect(Slack(config, result)).resolves.toBe(
      "[SLACK] No Notification is required because eveything is fine :)"
    );
  });

  test("Rejected if an issue occured", () => {
    const Errors = require("../errors");

    const Slack = require("./slack");
    const config = {
      url: "http://my-url.test/report",
      onlyFailed: false
    };

    testResult.scenarios = null;

    return expect(Slack(config, testResult)).rejects.toThrow(
      new Errors.DEFAULT(
        "SLACK REPORT",
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

    const Slack = require("./slack");
    const config = {
      url: "http://my-url.test/report",
      onlyFailed: false
    };

    await expect(Slack(config, testResult)).rejects.toThrow(
      new Errors.HTTP("SLACK REPORT", gotError)
    );

    const slackExpect = {
      attachments: [
        {
          color: "#007a5a",
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: "The test suite *Passed (10/10)*"
              }
            },
            {
              type: "section",
              fields: [
                {
                  type: "mrkdwn",
                  text: "*Name:* my test result"
                },
                {
                  type: "mrkdwn",
                  text: "*key:* MY-KEY"
                },
                {
                  type: "mrkdwn",
                  text: "*Environment:* local"
                },
                {
                  type: "mrkdwn",
                  text: "*Execution Id :* xxx-yyy-zzz"
                }
              ]
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: "*Scenarios:* \n *  Passed: 50 \n *  Failed: 0 \n *  Skipped: 10 \n * Undefined: 0"
              },
              accessory: {
                type: "image",
                image_url:
                  "https://restqa.io/assets/img/utils/restqa-logo-passed.png",
                alt_text: "status"
              }
            },
            {
              type: "context",
              elements: [
                {
                  type: "mrkdwn",
                  text: "*Powered By:*"
                },
                {
                  type: "mrkdwn",
                  text: "<https://restqa.io|@restqa>"
                }
              ]
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
      body: JSON.stringify(slackExpect)
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

    const Slack = require("./slack");

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

    await expect(Slack(config, testResult)).resolves.toBe(
      "[SLACK REPORT][201] - http://my-url.test/report"
    );

    const slackExpect = {
      attachments: [
        {
          color: "#ff0000",
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: "The test suite *Failed (9/10)*"
              }
            },
            {
              type: "section",
              fields: [
                {
                  type: "mrkdwn",
                  text: "*Name:* my test result"
                },
                {
                  type: "mrkdwn",
                  text: "*key:* MY-KEY"
                },
                {
                  type: "mrkdwn",
                  text: "*Environment:* local"
                },
                {
                  type: "mrkdwn",
                  text: "*Execution Id :* xxx-yyy-zzz"
                }
              ]
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: "*Scenarios:* \n *  Passed: 49 \n *  Failed: 1 \n *  Skipped: 10 \n * Undefined: 0"
              },
              accessory: {
                type: "image",
                image_url:
                  "https://restqa.io/assets/img/utils/restqa-logo-failed.png",
                alt_text: "status"
              }
            },
            {
              type: "context",
              elements: [
                {
                  type: "mrkdwn",
                  text: "*Powered By:*"
                },
                {
                  type: "mrkdwn",
                  text: "<https://restqa.io|@restqa>"
                }
              ]
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: [
                  "📕 *Feature*: Feature name",
                  "*Scenario*: This is scenario name",
                  "*Failed step*: When i have an issue (Line 45)",
                  "``` Not working ```",
                  "----"
                ].join("\n")
              }
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: "📊  <http://url-of-the-report/xxx-yyy-zzz|Acccess to the Test report>"
              }
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
      body: JSON.stringify(slackExpect)
    };
    expect(got.mock.calls).toHaveLength(1);
    expect(got.mock.calls[0][0]).toEqual(expectedOptions);
  });
});
