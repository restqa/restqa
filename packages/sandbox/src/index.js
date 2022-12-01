const path = require("path");
const EventEmitter = require("events");
const $Proxy = require("./services/proxy");
const $Fixture = require("./services/fixture");
const chalk = require("chalk");

module.exports = function (options) {
  options = options || {};
  options.logger = false;

  if (!options.outputFolder) {
    options.outputFolder = path.resolve(process.cwd(), "tests", "local");
  }

  if (!options.port) {
    options.port = 8888;
  }

  if (options.debug === true) {
    options.logger = true;
  }

  if (!options.stream) {
    options.stream = process.stdout;
  }

  if (!options.upstream) {
    throw new Error("Please provide the upstream url of your microservice");
  }

  options.event = new EventEmitter();

  $Fixture(options);
  $Proxy(options);

  process.on("uncaughtException", function (err) {
    const logs = [
      "\n",
      "------------------------------------------",
      `❌ ${chalk.red(err.message)}`,
      "------------------------------------------"
    ];

    if (options.debug) {
      console.log(err); // eslint-disable-line no-console
    }
    options.stream.write(logs.join("\n"));
  });
};
