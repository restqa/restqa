const fs = require("fs-extra");
const path = require("path");
const URL = require("url");
const open = require("open");

module.exports = async function (config, result) {
  const HTML_TEMPLATE_FOLDER = path.resolve(
    __dirname,
    "..",
    "..",
    "html-report-template",
    "dist"
  );

  config = config || {};
  if (undefined === config.browserOpening) {
    config.browserOpening = true;
  }
  config.folder = config.folder || path.resolve(process.cwd(), "report");

  try {
    fs.copySync(HTML_TEMPLATE_FOLDER, config.folder, {overwrite: true});

    const output = `window.RESTQA_RESULT = ${JSON.stringify(result, null, 2)}`;
    fs.writeFileSync(path.resolve(config.folder, "restqa-result.js"), output);

    const url = URL.pathToFileURL(
      path.resolve(config.folder, "index.html")
    ).href;

    config.browserOpening && (await open(url));
    return Promise.resolve(
      `[HTML REPORT][SUCCESS] - Your report has been generated at ${url}`
    );
  } catch (e) {
    return Promise.reject(
      new Error(`[HTML REPORT][ERROR] - ${config.folder} : ${e.message}`)
    );
  }
};
