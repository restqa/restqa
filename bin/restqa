#!/usr/bin/env node

const pkg = require("../package.json");
const updateNotifier = require("update-notifier");

const logger = require("../src/utils/logger");
const {program, telemetry} = require("./program");

const notifier = updateNotifier({
  pkg,
  shouldNotifyInNpmScript: true
});

async function main() {
  return program.parseAsync(process.argv);
}

main()
  .catch((e) => {
    telemetry.track("error", e.message, process.argv.join(" "));
    logger.error(e);
    process.exit(1);
  })
  .finally(() => {
    if (notifier.update) {
      notifier.notify();
    }
  });
