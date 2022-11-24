const got = require("got");
const Errors = require("../errors");

module.exports = function (config, result) {
  return new Promise((resolve, reject) => {
    try {
      if (undefined === config.onlyFailed) {
        config.onlyFailed = true;
      }

      if (!config.url) {
        return reject(
          new Error('config.url is required for the "microsoft-teams" report')
        );
      }

      const url = new URL(config.url);

      if (config.onlyFailed === true && result.success === true) {
        return resolve(
          "[MICROSOFT TEAMS] No notification is required because eveything is fine :)"
        );
      }

      const getStepsError = function () {
        return result.features
          .filter((_) => !_.result)
          .map((feature) => {
            return feature.elements
              .filter((_) => !_.result)
              .map((scenario) => {
                const step = scenario.steps.find(
                  (_) => _.result.status === "failed"
                );
                if (!step) return null;
                return {
                  activityTitle: `📕 *Feature*: ${feature.feature_name}`,
                  facts: [
                    {
                      name: "Scenario",
                      value: scenario.name
                    },
                    {
                      name: "Failed step",
                      value: `${step.keyword} ${step.name} (Line ${step.line})`
                    },
                    {
                      name: "Error message",
                      // The formatting for the below value is the 'fix' for a bug in code display
                      // on the Teams platform. A double newline and double indent will trigger
                      // a code block that wraps your code rather than letting it overflow off
                      // the screen.
                      value: `\n\n    ${step.result.error_message
                        .split("\n")
                        .join("\n    ")}`
                    }
                  ],
                  markdown: true
                };
              })
              .filter((_) => _);
          })
          .flat();
      };

      const status = result.success ? "passed" : "failed";
      let sections = [
        {
          activityTitle: "Details",
          activitySubtitle:
            "*Powered By:* [@restqa](https://restqa.io|@restqa)",
          activityImage: `https://restqa.io/assets/img/utils/restqa-logo-${status.toLowerCase()}.png`,
          activityText: `Name: ${result.name}\n\nEnvironment: ${
            result.env || ""
          }\n\nKey: ${result.key || ""}\n\nExecution Id: ${result.id}\n\n`,
          facts: [
            {
              name: "Scenarios",
              value: ""
            },
            {
              name: "• Passed",
              value: `${result.scenarios.passed}`
            },
            {
              name: "• Failed",
              value: `${result.scenarios.failed}`
            },
            {
              name: "• Skipped",
              value: `${result.scenarios.skipped}`
            },
            {
              name: "• Undefined",
              value: `${result.scenarios.undefined}`
            }
          ],
          markdown: true
        }
      ];

      if (config.showErrors) {
        sections = sections.concat(getStepsError());
      }

      const potentialAction = [];
      if (config.reportUrl) {
        potentialAction.push({
          "@type": "OpenUri",
          name: "📊 View test report",
          targets: [
            {
              os: "default",
              uri: `${config.reportUrl.replace("{uuid}", result.id)}`
            }
          ]
        });
      }

      const data = {
        "@type": "MessageCard",
        "@context": "http://schema.org/extensions",
        themeColor: result.success ? "007a5a" : "ff0000",
        summary: `${result.name} ${status}`,
        title: `Test suite ${result.name ? `"${result.name}" ` : ""}results`,
        text: `The test suite **${status} (${result.passed}/${result.total})**`,
        sections,
        potentialAction
      };

      const options = {
        hostname: url.hostname,
        port: url.port,
        protocol: url.protocol,
        pathname: url.pathname,
        method: "POST",
        body: JSON.stringify(data)
      };

      got(options)
        .then((res) => {
          resolve(
            `[MICROSOFT TEAMS REPORT][${res.statusCode}] - ${config.url}`
          );
        })
        .catch((err) => {
          reject(new Errors.HTTP("MICROSOFT TEAMS REPORT", err));
        });
    } catch (e) {
      reject(new Errors.DEFAULT("MICROSOFT TEAMS REPORT", e));
    }
  });
};
