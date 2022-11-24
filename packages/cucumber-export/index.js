const {JsonFormatter, Formatter} = require("@cucumber/cucumber");
const argvParser = require("@cucumber/cucumber/lib/cli/argv_parser").default;
const optionSplitter =
  require("@cucumber/cucumber/lib/cli/option_splitter").default;
const testStepResultStatus = require("@cucumber/messages").TestStepResultStatus;
const Transport = require("./src");
const fs = require("fs");

function getFormatter(config) {
  config.title = config.title || "CUCUMBER EXPORT";
  return class RestQaFormatter extends Formatter {
    constructor(options) {
      super(options);
      if (this.stream.fd === process.stdout.fd) {
        // Stop the process IF the current stream is stdout...
        const errorMessage = [
          this.colorFns.forStatus((status) => {
            const {FAILED, PENDING} = testStepResultStatus;
            switch (status) {
              case FAILED:
                return "You need to specify a PATH to store the debug logs (example: --format <TYPE[:PATH]>)";
              case PENDING:
                return "=> Refer at the cucumber-js documentation (https://github.com/cucumber/cucumber-js/blob/master/docs/cli.md#formats)";
            }
          }),
          ""
        ];
        this.log(errorMessage.join("\n"));
        return;
      }

      options.eventBroadcaster.on("envelope", (envelope) => {
        if (envelope.testRunFinished) {
          this.onTestRunFinished(envelope.testRunFinished);
        }
      });
    }

    getLogPath() {
      const args = argvParser.parse(process.argv);

      if (args.options.format && args.options.format.length > 0) {
        const writeFile = optionSplitter.split(args.options.format[0])[1];
        return writeFile;
      }

      return undefined;
    }

    writeLog(text) {
      if (!this.stream.writable) {
        const writeFile = this.getLogPath();
        if (writeFile) {
          fs.writeFileSync(writeFile, text, "utf-8");
        }
      } else {
        this.log(text);
      }
    }

    onTestRunFinished(testRunResult) {
      process.nextTick(async () => {
        const format = new Transport(config, testRunResult);
        const options = {
          eventDataCollector: this.eventDataCollector,
          eventBroadcaster: {on: () => {}},
          supportCodeLibrary: this.supportCodeLibrary,
          log: async (result) => {
            const STATUS_ICON = {
              fulfilled: "✅",
              rejected: "❌"
            };

            process.stdout.write(`|===> ${config.title} 📦  \n`);

            let inProgress = true;
            let response = [];
            const timer = setInterval(() => {
              if (inProgress) {
                return process.stdout.write(".");
              }
              clearTimeout(timer);
            }, 100);

            try {
              result = JSON.parse(result);
              response = await format.exports(result);
              response = response || [];
              inProgress = false;
              const stdOut = response.map((_) => {
                return `\n|=> ${STATUS_ICON[_.status]}  ${
                  _.status === "fulfilled" ? "Successful" : "Unsuccessful"
                } export - ${_.value || _.reason.customMsg}`;
              });
              if (!response.length) {
                stdOut.push("> No exporter configured");
              }
              process.stdout.write(stdOut.join(""));
            } catch (err) {
              inProgress = false;

              // eslint-disable-next-line no-console
              console.log(err); // @TODO : do something here please...
            }

            const errors = response.filter((_) => _.reason);
            if (errors.length) {
              const logs = errors.map((err) => {
                return (
                  err.reason.toString() +
                  "\n\n-------------------------------------------------------------"
                );
              });
              this.writeLog(logs.join("\n"));
              process.stdout.write(
                `\n\n🥺  Find the detail of the errors on the file : ${this.getLogPath()}\n`
              );

              if (process.stdout.isTTY) {
                process.stdout.write(logs.join("\n"));
              }
            }

            process.stdout.write("\n");
          }
        };

        const jsonResult = new JsonFormatter(options);
        jsonResult.onTestRunFinished();
      });
    }
  };
}

function Export(result, options) {
  const duration = 0;
  const success = result
    .map((feature) => {
      return feature.elements
        .map((scenario) => {
          return scenario.steps.reduce(
            (a, step) => a && step.result.status === "passed",
            true
          );
        })
        .reduce((a, i) => a && i, true);
    })
    .reduce((a, i) => a && i, true);

  const format = new Transport(options, {result: {duration, success}});
  return format.exports(result);
}

module.exports = {
  getFormatter,
  Export
};
