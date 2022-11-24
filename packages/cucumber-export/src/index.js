const moment = require("moment");
const {v4: uuidv4} = require("uuid");
const Format = require("./format");
const Reports = require("./reports");

module.exports = function (config, testSuiteResult) {
  if (!Array.isArray(config.outputs)) {
    throw new Error("The config.outputs needs to be an array");
  }

  const reports = Object.assign(Reports, config.customExporters || {});

  config.outputs.forEach((out) => {
    if (!reports[out.type])
      throw new Error(
        `The ${out.type} output doesn't exist. Available: ${Object.keys(
          reports
        ).join(", ")}`
      );
  });

  function exports(result) {
    if (!result.length) return;

    const metadata = {
      id: config.uuid || uuidv4(),
      startTime: config.startTime || moment().format(),
      name: config.name,
      key: config.key,
      env: config.env,
      repository: config.repository,
      sha: config.sha,
      ...testSuiteResult.result
    };

    result = Format(metadata, result);

    const outputs = config.outputs
      .filter((output) => output.enabled)
      .map((output) => {
        return reports[output.type].call(this, output.config, {...result});
      });

    if (!outputs.length) return;

    return Promise.allSettled(outputs);
  }

  return {
    exports
  };
};
