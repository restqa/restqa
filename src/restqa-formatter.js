const {getFormatter} = require("@restqa/cucumber-export");
const Config = require("./config");
const Welcome = require("./utils/welcome");

const restqa = {
  env: process.env.RESTQA_ENV && String(process.env.RESTQA_ENV).toLowerCase(),
  configFile: process.env.RESTQA_CONFIG,
  tmpFileExport: global.restqa && global.restqa.tmpExport,
  report: (global.restqaOptions && global.restqaOptions.report) || false
};

const config = new Config();
config.load(restqa.configFile);

const msg = new Welcome(config.getSettings().getTips());

let title = "Exporting the test result...";
title = msg.text || title;

const test = {
  name: config.getUnitTest().getName(),
  outputs: [
    {
      type: "html",
      enabled: restqa.report,
      config: {
        folder: "restqa"
      }
    }
  ]
};

if (restqa.env) {
  test.name = config.getIntegrationTest(restqa.env).getName();
  test.outputs = config.getIntegrationTest(restqa.env).getOutputs();
}

const options = {
  title,
  key: config.getCode(),
  name: config.getName(),
  env: test.name,
  repository:
    process.env.GITHUB_REPOSITORY ||
    process.env.CI_PROJECT_PATH ||
    process.env.BITBUCKET_REPO_SLUG ||
    process.env.RESTQA_REPOSITORY,
  sha:
    process.env.GITHUB_SHA ||
    process.env.CI_COMMIT_SHA ||
    process.env.BITBUCKET_COMMIT ||
    process.env.RESTQA_COMMIT_SHA,
  outputs: test.outputs || []
};

if (restqa.tmpFileExport) {
  options.outputs.push({
    type: "stream",
    enabled: true,
    config: {
      instance: restqa.tmpFileExport
    }
  });
}

module.exports = getFormatter(options);
