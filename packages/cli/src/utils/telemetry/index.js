const path = require("path");
const childProcess = require("child_process");
const Preference = require("../../config/preference");

class Telemetry {
  constructor(options) {
    this._preference = new Preference();
    this._options = options;
  }

  toggle(val) {
    this._preference.telemetry = val;
  }

  track(category, action, label) {
    const cp = childProcess.fork(path.join(__dirname, "child.js"), {
      silent: true
    });
    cp.send({
      consent: this._preference.telemetry,
      category,
      action,
      label,
      ...this._options
    });
    cp.unref();
    cp.disconnect();
  }
}

module.exports = Telemetry;
