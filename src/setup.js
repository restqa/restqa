const Cucumber = require("@cucumber/cucumber");
const Bootstrap = require("./core/bootstrap");

const globals = global.restqaOptions;

if (globals.env) {
  process.env.RESTQA_ENV = globals.env && String(globals.env).toUpperCase();
}
process.env.RESTQA_CONFIG = globals.config;

const options = {
  env: process.env.RESTQA_ENV,
  configFile: process.env.RESTQA_CONFIG,
  command: globals.command,
  silent: globals.silent
};

Bootstrap(Cucumber, options);
