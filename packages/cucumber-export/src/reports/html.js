const path = require("path");
const Report = require("@restqa/report-ui");

module.exports = async function (config, result) {
  config = config || {};
  if (undefined === config.browserOpening) {
    config.browserOpening = true;
  }
  config.folder = config.folder || path.resolve(process.cwd(), "report");

  try {
    const options = {
      browserOpening: config.browserOpening,
      dataOutput: {
        RESTQA_RESULT: result
      },
      folder: config.folder
    };
    const url = await Report(options);

    return Promise.resolve(
      `[HTML REPORT][SUCCESS] - Your report has been generated at ${url}`
    );
  } catch (e) {
    return Promise.reject(
      new Error(`[HTML REPORT][ERROR] - ${config.folder} : ${e.message}`)
    );
  }
};
