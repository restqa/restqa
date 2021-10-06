const path = require("path");
const fs = require("fs");
const cucumber = require("@cucumber/cucumber");
const logger = require("../utils/logger");
const {execute} = require("../utils/executor");

module.exports = async function (opt, program = {}) {
  let {env, config, tags = [], stream = process.stdout, args, command} = opt;

  args = args || program.args || ["."];

  if (!args.length) args.push(".");

  const invalidTags = tags.filter((tag) => tag.substr(0, 1) !== "@");
  if (invalidTags.length) {
    return Promise.reject(
      new Error(
        `The tags should start with the symbol "@" (example: @${invalidTags[0]})`
      )
    );
  }

  if (args.length === 1) {
    const folderToSearch = path.resolve(args[0]);
    const isFolder = fs.lstatSync(folderToSearch).isDirectory();
    if (isFolder) {
      const configFile = path.join(folderToSearch, ".restqa.yml");
      if (!config && fs.existsSync(configFile)) {
        config = configFile;
      }
    }
  }

  const currentPathGlob = path.resolve(
    ".",
    "{*.feature,!(node_modules)",
    "**",
    "*.feature}"
  );
  const paths = args.map((_) =>
    _ === "." ? currentPathGlob : path.resolve(_)
  );

  // -- config
  config = config || path.join(process.cwd(), ".restqa.yml");
  if (!fs.existsSync(config)) {
    return Promise.reject(
      new TypeError(`The configuration file "${config}" doesn't exist.`)
    );
  }

  global.restqaOptions = {
    config,
    env
  };

  // TODO : Add extra cucumber parameters from config file
  const customOptions = [
    "node",
    "cucumber-js",
    "--require",
    "../src/setup.js",
    "--format",
    "../src/restqa-formatter:.restqa.log",
    "--format-options",
    '{"snippetSyntax": "../src/restqa-snippet.js"}'
  ];

  if (tags) {
    tags.forEach((tag) => {
      customOptions.push("--tags");
      customOptions.push(tag);
    });
  }

  const options = {
    argv: customOptions.concat(paths),
    cwd: path.join(__dirname, "../"),
    stdout: stream
  };

  const cucumberCli = new cucumber.Cli(options);

  if (typeof command === "string") {
    await execute(command);
  }

  return cucumberCli
    .run()
    .then((result) => {
      const exitCode = result.success ? 0 : 1;
      if (result.shouldExitImmediately) {
        process.exit(exitCode);
      } else {
        process.exitCode = exitCode;
      }
    })
    .catch((err) => {
      logger.error(err);
      process.exit(1);
    });
};
