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
          new Error('config.url is required for the "discord" report')
        );
      }

      const url = new URL(config.url);

      if (config.onlyFailed === true && result.success === true) {
        return resolve(
          "[DISCORD] No notification is required because eveything is fine :)"
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
                  name: `📕 **Feature**: ${feature.feature_name}`.slice(0, 256), // Discord supports up to 256 charcters in field name
                  value: [
                    `**Scenario**: ${scenario.name}`,
                    `**Failed step**: ${step.keyword} ${step.name} (Line ${step.line})`,
                    `\`\`\` ${step.result.error_message} \`\`\``,
                    "----"
                  ]
                    .join("\n")
                    .slice(0, 1024) // Discord supports up to 1024 characters in field value
                };
              })
              .filter((_) => _);
          })
          .flat()
          .slice(0, 25); // Discord supports up to 25 embeds field, need to truncate after
      };

      const status = result.success ? "passed" : "failed";
      const embed = {
        title: `The test suite **${status} (${result.passed}/${result.total})**`,
        description: `**Name:** ${result.name}
**Key:** ${result.key || ""}
**Environment:** ${result.env}
**Execution Id:** ${result.id}

**Scenarios:**
- **Passed:** ${result.scenarios.passed}
- **Failed:** ${result.scenarios.failed}
- **Skipped:** ${result.scenarios.skipped}
- **Undefined:** ${result.scenarios.undefined}

*Powered By:* [@restqa](https://restqa.io)`.slice(0, 2048), // Discord supports up to 2048 characters in embeds description
        thumbnail: {
          url: `https://restqa.io/assets/img/utils/restqa-logo-${status.toLowerCase()}.png`
        },
        color: result.success ? 31322 : 16711680
      };

      if (config.showErrors) {
        embed.fields = getStepsError();
      }

      if (config.reportUrl) {
        embed.url = config.reportUrl.replace("{uuid}", result.id);
        embed.description =
          `[**📊 View test report**](${config.reportUrl.replace(
            "{uuid}",
            result.id
          )})\n`.concat(embed.description);
      }

      const data = {
        username: config.username || null,
        tts: config.tts || false,
        embeds: [embed]
      };

      const options = {
        hostname: url.hostname,
        port: url.port,
        protocol: url.protocol,
        pathname: url.pathname,
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json"
        }
      };

      got(options)
        .then((res) => {
          resolve(`[DISCORD REPORT][${res.statusCode}] - ${config.url}`);
        })
        .catch((err) => {
          reject(new Errors.HTTP("DISCORD REPORT", err));
        });
    } catch (e) {
      reject(new Errors.DEFAULT("DISCORD REPORT", e));
    }
  });
};
