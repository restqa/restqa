/*
 * This entry point is used for the tests
 *
 */

const path = require("path");
const Sandbox = require("./index.js");
const rimraf = require("rimraf");
const fs = require("fs");

const outputFolder = path.resolve(process.cwd(), "tests-generated", "local");
rimraf.sync(outputFolder);

const stream = {
  write(content) {
    const filename = path.resolve(outputFolder, "tmp.console");
    let original = "";
    if (fs.existsSync(filename) === true) {
      original = fs.readFileSync(filename).toString();
    }
    const dirname = path.dirname(filename);

    fs.mkdirSync(dirname, {recursive: true});

    fs.writeFileSync(filename, original + content);
  }
};

Sandbox({
  port: 3001,
  debug: false,
  upstream: "http://localhost:9999",
  outputFolder,
  stream
});
