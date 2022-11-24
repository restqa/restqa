const got = require("got");
const {URL} = require("url");
const moment = require("moment");
const $async = require("async");
const Errors = require("../errors");

module.exports = function (config, testRun) {
  return new Promise((resolve, reject) => {
    if (!config.url)
      return reject(
        new Error('config.url is required for the "elastic-search" report')
      );

    const url = new URL(config.url);
    config.index = config.index || "restqa-e2e-result";
    const index = config.index + "-" + moment().format("YYYYMMDD");

    const options = {
      hostname: url.hostname,
      port: url.port,
      protocol: url.protocol,
      pathname: `/${index}/_doc`,
      method: "POST",
      responseType: "json"
    };

    // let result = 0
    const errors = [];

    const q = $async.queue(function (opt, callback) {
      got(opt)
        .then((res) => {
          // result++
          callback();
        })
        .catch(callback);
    }, 5);

    q.error(function (err, task) {
      errors.push(new Errors.HTTP("ELASTIC-SEARCH", err));
    });

    q.drain(() => {
      if (errors.length) {
        return reject(errors[0]);
      }
      resolve(`[ELASTIC-SEARCH REPORT] - ${config.url} - index : ${index}`);
    });

    const {features} = testRun;
    delete testRun.features;

    q.push(Object.assign({json: testRun}, options));

    features.forEach((feature) => {
      q.push(Object.assign({json: feature}, options));
      feature.elements.forEach((scenario) => {
        q.push(Object.assign({json: scenario}, options));
      });
    });
  });
};
