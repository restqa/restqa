const Executor = require("./executor");
const GitStat = require("./git-stat");

module.exports = function ({env, config}, processor = {}) {
  global.result = {};
  global.restqa = global.restqa || {};

  if (!processor.BeforeAll || !processor.AfterAll) {
    throw new Error(
      "Please provide a processor containing the methods:  BeforeAll, AfterAll"
    );
  }

  processor.Before(async function (scenario) {
    // In order to fetch the dynamic data from extenral sources.
    // Let's parse the scenario to get all the placeholder
    await this.data.parse(scenario);
  });

  processor.Before({tags: "@skip or @wip"}, function () {
    this.skipped = true;
    return "skipped";
  });

  if (!env) {
    processor.BeforeAll(async function () {
      this.restqa = this.restqa || {};
      const envs = (this.restqa.mock || {}).http;
      const options = {
        port: config.getUnitTest().getPort(),
        command: config.getUnitTest().getCommand(),
        envs
      };
      const microservice = new Executor(options);
      await microservice.execute();
      this.restqa.microservice = microservice;
    });

    processor.AfterAll(async function () {
      this.restqa.microservice && this.restqa.microservice.terminate();
      if (this.restqa.report) {
        global.restqa.contributors = await GitStat();
      }
    });
  }
};
