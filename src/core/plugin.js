const {ChildProcess} = require("child_process");
const treekill = require("treekill");
const {execute, checkServer} = require("../core/executor");
const Locale = require("../locales")("service.run");

module.exports = function ({command, config}, processor = {}) {
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

  if (command) {
    let server;
    processor.BeforeAll(async function () {
      if (typeof command === "string") {
        const {envs} = this.mock || {};
        server = await execute(command, envs);
        const restqapi = getPluginConfig("@restqa/restqapi", config);
        if (!restqapi) {
          throw new Error(Locale.get("error_missing_restqapi"));
        }
        const {url} = restqapi;
        if (!url) {
          throw new Error(Locale.get("error_missing_url"));
        }
        let port = url.split(":").pop();
        if (Number.isNaN(Number.parseInt(port))) {
          port = 80;
        }
        await checkServer(port);
      }
    });

    processor.AfterAll(() => {
      if (server instanceof ChildProcess) {
        treekill(server.pid);
      }
    });
  }
};

function getPluginConfig(pluginName, config) {
  const plugin = config.environment.plugins.find((_) => _.name === pluginName);
  return (plugin || {}).config;
}