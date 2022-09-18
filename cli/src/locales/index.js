const YAML = require("yaml");
const path = require("path");
const fs = require("fs");

let CurrentLanguage;

module.exports = function (prefix) {
  if (!CurrentLanguage) {
    const data = fs.readFileSync(path.resolve(__dirname, "en.yml"));
    CurrentLanguage = YAML.parse(data.toString("utf-8"));
  }

  const get = (key) => {
    if (prefix) {
      key = `${prefix}.${key}`;
    }
    return key.split(".").reduce((result, item) => {
      result = result || {};
      return result[item];
    }, CurrentLanguage);
  };

  return {
    get
  };
};
