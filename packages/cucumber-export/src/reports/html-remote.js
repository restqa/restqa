const got = require("got");
const Errors = require("../errors");
const {URL} = require("url");

const dashboardReportsURL = "https://dashboard.restqa.io/reports";

function getExpiryTimeMessage(config) {
  if (config.url === dashboardReportsURL) {
    return " (This link will expire in 5 minutes)";
  }

  return "";
}
module.exports = function (config, result) {
  return new Promise((resolve, reject) => {
    config = config || {};
    config.url = config.url || dashboardReportsURL;
    const url = new URL(config.url);

    const options = {
      hostname: url.hostname,
      port: url.port,
      protocol: url.protocol,
      pathname: url.pathname,
      method: "POST",
      json: result
    };

    if (config.auth) {
      const {username, password} = config.auth;

      options.headers = {
        authorization: `Basic ${Buffer.from(
          username + ":" + password,
          "utf8"
        ).toString("base64")}`
      };
    }

    got(options)
      .then((res) =>
        resolve(
          `[HTML REMOTE][${res.statusCode}] - Access to your test report : ${
            config.url + "/" + result.id
          }` + getExpiryTimeMessage(config)
        )
      )
      .catch((err) => {
        reject(new Errors.HTTP("HTML REMOTE", err));
      })
      .catch((err) => {
        reject(new Errors.HTTP("HTTP HTML REPORT", err));
      });
  });
};
