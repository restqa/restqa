const {program, Argument} = require("commander");
const path = require("path");

const pkg = require("../package.json");
const Cli = require("../src/cli");
const logger = require("../src/utils/logger");
const Telemetry = require("../src/utils/telemetry");

const DEFAULT_CONFIG =
  process.env.RESTQA_CONFIG || path.resolve(process.cwd(), ".restqa.yml");

const telemetry = new Telemetry(pkg);
program.version(pkg.version).hook("preAction", (parent, cmd) => {
  telemetry.track("cli", cmd.name(), cmd.args.join(" "));
});

program
  .command("steps [keyword]")
  .alias("st")
  .alias("step")
  .option("-c, --config <config>", "Use a specific .restqa.yml file")
  .option("-t, --tag <tag>", "Filter the step definition by tag")
  .option(
    "-o, --output <output>",
    "Formating the output: short | medium | large"
  )
  .description("Get the list of step by keyword : given | when | then")
  .action(Cli.Steps);

program
  .command("generate")
  .alias("gen")
  .allowUnknownOption()
  .description("Generate a Test scenario from a curl command")
  .usage("[global options] command")
  .action(Cli.Generate);

program
  .command("run")
  .alias("r")
  .option("-e, --env <env>", "Define the current environment")
  .option("-c, --config <config>", "Use a specific .restqa.yml file")
  .option(
    "-t, --tags <tags>",
    "Use --tags <EXPRESSION> to run specific features or scenarios (example: @prod)",
    (value, previous) => (previous || []).concat([value])
  )
  .option("-r, --report", "Export and open the RestQA report", false)
  .option("-s, --silent", "Hide the logs output of the microservice", false)
  .description("Execute the RestQA test suite")
  .usage("-c ./.restqa.yml -e local -t @success customer.feature")
  .action(Cli.Run);

program
  .command("telemetry")
  .addArgument(
    new Argument("[status]", 'status of the telemetry (choices: "on", "off")')
  )
  .description("Enable or disable the telemetry")
  .usage("[status]")
  .action(Cli.Telemetry);

program.on("--help", () => {
  /* eslint-disable no-console */
  logger.log(
    "  For more details please visit https://github.com/restqa/restqa"
  );
  /* eslint-enable no-console */
});

module.exports = {
  program: program,
  telemetry
};
