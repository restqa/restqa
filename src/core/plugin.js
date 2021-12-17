const {ChildProcess} = require("child_process");
const treekill = require("treekill");
const {execute, checkServer} = require("../core/executor");

module.exports = function ({env, config}, processor = {}) {
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
    let server;
    processor.BeforeAll(async function () {
      const port = config.getUnitTest().getPort();
      const {mock} = this.restqa || {};
      const envs = (mock || {}).http;
      server = await execute(config.getUnitTest().getCommand(), envs);
      await checkServer(port);
    });

    processor.AfterAll(() => {
      if (server instanceof ChildProcess) {
        treekill(server.pid);
      }
    });
  }
};
