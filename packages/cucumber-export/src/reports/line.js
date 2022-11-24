const got = require("got");
const Errors = require("../errors");

module.exports = function (config, result) {
  return new Promise((resolve, reject) => {
    try {
      if (undefined === config.onlyFailed) {
        config.onlyFailed = true;
      }

      if (!config.token)
        return reject(
          new Error('config.token is required for the "line" report')
        );

      const url = new URL("https://notify-api.line.me/api/notify");

      if (config.onlyFailed === true && result.success === true)
        return resolve(
          "[LINE] No Notification is required because eveything is fine :)"
        );

      const status = result.success ? "Passed" : "Failed";
      const message = [
        `The test suite ${status} (${result.passed}/${result.total})`,
        `Name: ${result.name}`,
        `key: ${result.key}`,
        `Environment: ${result.env}`,
        `Execution Id : ${result.id}`,
        "Scenarios:",
        `  * ✅ Passed: ${result.scenarios.passed}`,
        `  * ❌ Failed: ${result.scenarios.failed}`,
        `  * ⚠️ Skipped: ${result.scenarios.skipped}`,
        `  * ⁉️ Undefined: ${result.scenarios.undefined}`
      ];

      if (config.reportUrl) {
        message.push(`📊  ${config.reportUrl.replace("{uuid}", result.id)}`);
      }

      const form = {
        message: message.join("\n"),
        imageThumbnail: `https://restqa.io/assets/img/utils/restqa-logo-${status.toLowerCase()}.png`,
        imageFullsize: `https://restqa.io/assets/img/utils/restqa-logo-${status.toLowerCase()}.png`,
        notificationDisabled: false
      };

      const options = {
        hostname: url.hostname,
        port: url.port,
        protocol: url.protocol,
        pathname: url.pathname,
        method: "POST",
        form,
        headers: {
          authorization: `Bearer ${config.token}`
        }
      };

      got(options)
        .then((res) => {
          resolve(`[LINE REPORT][${res.statusCode}] - Notification sent!`);
        })
        .catch((err) => {
          reject(new Errors.HTTP("LINE REPORT", err));
        });
    } catch (e) {
      reject(new Errors.DEFAULT("LINE REPORT", e));
    }
  });
};
