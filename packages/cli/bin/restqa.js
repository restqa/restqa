#!/usr/bin/env node

const pkg = require("../package.json");
const updateNotifier = require("update-notifier");

const { Logger } = require("@restqa/core-logger");
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
    Logger.error(e);
    process.exitCode = 1;
  })
  .finally(() => {
    process.emit('RESTQA.KILL', process.exitCode)
    if (notifier.update) {
      notifier.notify();
    }
  });
