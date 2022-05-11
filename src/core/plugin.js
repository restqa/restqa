const Executor = require("./executor");
const GitStat = require("./git-stat");
const Performance = require('./performance')
const path = require('path')

module.exports = function ({env, report, config}, processor = {}) {
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
    });
  }

  if (report) {
    let performanceInstance;
    if (!config.getPerformanceTest().isEmpty()) {
      processor.Before('@performance', function(scenario) {
        const performance = config.getPerformanceTest().toJSON()
        performance.outputFolder = performance.outputFolder || path.resolve(process.cwd(), "tests", "performance");
        performance.onlySuccess = performance.onlySuccess === undefined ? true : Boolean(performance.onlySuccess);
        performanceInstance = new Performance(performance);
      })

      processor.After('@performance', function(scenario) {
        if (performanceInstance) {
          performanceInstance.add(this.apis, scenario)
        }
      })
    }

    processor.AfterAll(async function () {
      global.restqa.contributors = await GitStat();
      if (performanceInstance) {
        this.restqa.performance = performanceInstance.generate();
      }
    });
  }

};
