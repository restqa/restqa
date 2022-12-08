import assert from "assert";
import fs from "fs";
import path from "path";

const reportFile = path.resolve("restqa/index.html");
const exportFile = path.resolve("screenshot-restqa.png");

assert.ok(fs.existsSync(reportFile), `Missing report file: ${reportFile} `);
assert.ok(fs.existsSync(exportFile), `Missing export file: ${exportFile} `);
assert.ok(
  fs.statSync(exportFile).size > 0,
  `The export file should not be empty: ${exportFile} `
);
