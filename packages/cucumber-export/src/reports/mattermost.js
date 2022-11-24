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
          new Error('config.url is required for the "mattermost" report')
        );
      }

      const url = new URL(config.url);

      if (config.onlyFailed === true && result.success === true) {
        return resolve(
          "[MATTERMOST] No notification is required because eveything is fine :)"
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
                  title: `📕 Feature: ${feature.feature_name}`,
                  value: `**Scenario: ** ${scenario.name}
**Failed Step: ** ${step.keyword} ${step.name} (Line ${step.line})
${"```"}
${step.result.error_message}
${"```"}`
                };
              })
              .filter((_) => _);
          })
          .flat();
      };

      const status = result.success ? "Passed" : "Failed";
      const attachment = {
        author_name: "@restqa",
        author_link: "https://restqa.io",
        author_icon: "https://restqa.io/assets/img/favicon.png",
        title: `The test suite *${status} (${result.passed}/${result.total})*`,
        color: result.success ? "#007a5a" : "#ff0000",
        fields: [
          {
            short: true,
            title: "Name",
            value: `${result.name || ""}`
          },
          {
            short: true,
            title: "Key",
            value: `${result.key || ""}`
          },
          {
            short: true,
            title: "Environment",
            value: `${result.env || ""}`
          },
          {
            short: true,
            title: "Execution Id",
            value: `${result.id || ""}`
          },
          {
            title: "Scenarios",
            value: `* Passed: ${result.scenarios.passed}
* Failed: ${result.scenarios.failed}
* Skipped: ${result.scenarios.skipped}
* Undefined: ${result.scenarios.undefined}`
          }
        ],
        thumb_url: `https://restqa.io/assets/img/utils/restqa-logo-${status.toLowerCase()}.png`
      };

      if (config.showErrors) {
        const errors = getStepsError();
        const displayedErrorsLimit = config.displayedErrorsLimit || 25;

        attachment.fields = attachment.fields.concat(
          errors.slice(0, displayedErrorsLimit)
        );

        if (errors.length > displayedErrorsLimit) {
          attachment.fields = attachment.fields.concat({
            title: "",
            value: `*${errors.length - displayedErrorsLimit} hidden errors*`
          });
        }
      }

      if (config.reportUrl) {
        const section = {
          title: "",
          value: `📊 <${config.reportUrl.replace(
            "{uuid}",
            result.id
          )}|View test report>`
        };
        attachment.fields = attachment.fields.concat(section);
      }

      const data = Object.entries({
        channel: config.channel,
        username: config.username,
        icon_url: config.iconUrl,
        icon_emoji: config.iconEmoji,
        attachments: [attachment]
      })
        .filter((entry) => entry[1] != null)
        .reduce((obj, entry) => {
          obj[entry[0]] = entry[1];
          return obj;
        }, {});

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
          resolve(`[MATTERMOST REPORT][${res.statusCode}] - ${config.url}`);
        })
        .catch((err) => {
          reject(new Errors.HTTP("MATTERMOST REPORT", err));
        });
    } catch (e) {
      reject(new Errors.DEFAULT("MATTERMOST REPORT", e));
    }
  });
};
