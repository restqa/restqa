const path = require("path");
const open = require("open");
const URL = require("url");
const fs = require("fs-extra");

async function Report(options) {
  let { browserOpening, folder, dataOutput } = options || {};

  const HTML_TEMPLATE_FOLDER = path.resolve(__dirname, "dist");

  if (undefined === browserOpening) {
    browserOpening = true;
  }

  folder = folder || path.resolve(process.cwd(), "restqa");

  fs.copySync(HTML_TEMPLATE_FOLDER, folder, { overwrite: true });

  const output = `window.OUTPUT = ${JSON.stringify(dataOutput, null, 2)}\n\n`;

  fs.writeFileSync(path.resolve(folder, "restqa.result.js"), output);

  const url = URL.pathToFileURL(path.resolve(folder, "index.html")).href;

  if (undefined !== process.env.CI) {
    browserOpening = false;
  }

  browserOpening && (await open(url));
  return url;
}

module.exports = Report;
