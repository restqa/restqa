const Cucumber = require("@cucumber/cucumber");
const Bootstrap = require("./core/bootstrap");

const {restqa} = global;
const options = {
  env: restqa.env,
  config: restqa.config,
  isLocalTest: restqa.isLocalTest(),
  outputStream: restqa.outputStream,
  report: restqa.report
};

Bootstrap(Cucumber, options);
