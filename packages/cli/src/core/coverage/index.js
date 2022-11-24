const {Report} = require("c8");
const fs = require("fs");
const path = require("path");
const os = require("os");

class Coverage {
  constructor(options) {
    this._tmp = path.resolve(options.tmp || os.tmpdir(), "restqa-cov");
    if (fs.existsSync(this._tmp) === false) {
      fs.mkdirSync(this._tmp, {recursive: true, force: true});
    }

    this._report = path.resolve(options["restqa-report"], "coverage");

    if (options.filename) {
      this._filename = path.resolve(process.cwd(), options.filename);
      this._isCustom = true;
    } else {
      this._filename = path.resolve(this.report, "index.html");
    }
  }

  get isCustom() {
    return this._isCustom || false;
  }

  get filename() {
    return this._filename;
  }

  get tmp() {
    return this._tmp;
  }

  get report() {
    return this._report;
  }

  generate() {
    if (this.isCustom) {
      return Promise.resolve();
    }
    const options = {
      reporter: ["html", "text", "json-summary"],
      tempDirectory: this.tmp,
      reportsDirectory: this.report
    };
    const report = Report(options);
    return report.run();
  }
}

module.exports = Coverage;
