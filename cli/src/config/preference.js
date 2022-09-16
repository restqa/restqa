const fs = require("fs");
const path = require("path");
const os = require("os");

class Preference {
  constructor(filename) {
    this._filename =
      filename || path.resolve(os.homedir(), ".config", "restqa.pref");
    const dirpath = path.dirname(this._filename);
    if (fs.existsSync(dirpath) === false) {
      fs.mkdirSync(dirpath, {recursive: true, mode: parseInt("0700", 8)});
    }
    if (fs.existsSync(this._filename) === true) {
      this._config = JSON.parse(
        fs.readFileSync(this._filename).toString("utf-8")
      );
    } else {
      this._config = null || {
        telemetry: false,
        projects: {}
      };
    }
  }

  getFilename() {
    return this._filename;
  }

  set telemetry(val) {
    this._config.telemetry = val;
    this._write();
  }

  get telemetry() {
    if (undefined === this._config.telemetry) {
      this.telemetry = false;
    }
    return this._config.telemetry;
  }

  addProject(name, config) {
    this._config.projects[name] = config;
    this._write();
  }

  getProject(name) {
    return this._config.projects[name];
  }

  _load() {}

  _write() {
    const content = JSON.stringify(this._config);
    fs.writeFileSync(this._filename, content, {
      mode: parseInt("0600", 8)
    });
  }

  toJSON() {
    return this._config;
  }
}

module.exports = Preference;
