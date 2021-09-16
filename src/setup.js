const Cucumber = require("@cucumber/cucumber");
const Bootstrap = require("./core/bootstrap");

if (global.restqaOptions.env) {
  process.env.RESTQA_ENV =
    global.restqaOptions.env && String(global.restqaOptions.env).toUpperCase();
}
process.env.RESTQA_CONFIG = global.restqaOptions.config;

const options = {
  env: process.env.RESTQA_ENV,
  configFile: process.env.RESTQA_CONFIG
};

Bootstrap(Cucumber, options);
