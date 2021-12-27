const {getFormatter} = require("@restqa/cucumber-export");
const Welcome = require("../utils/welcome");

/*
const restqa = {
  //env: process.env.RESTQA_ENV && String(process.env.RESTQA_ENV).toLowerCase(),
  //configFile: process.env.RESTQA_CONFIG,
  tmpFileExport: global.restqa && global.restqa.tmpExport,
  report: (global.restqaOptions && global.restqaOptions.report) || false
};
*/

const {restqa} = global;
const {config, env, report, exportStream} = restqa;

const msg = new Welcome(config.getSettings().getTips());

let title = "Exporting the test result...";
title = msg.text || title;

const test = {
  name: config.getUnitTest().getName(),
  outputs: [
    {
      type: "html",
      enabled: report,
      config: {
        folder: "restqa"
      }
    }
  ]
};

if (!restqa.isUnitTest()) {
  test.name = config.getIntegrationTest(env).getName();
  test.outputs = config.getIntegrationTest(env).getOutputs();
}

const options = {
  title,
  key: config.code,
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

if (restqa.exportStream) {
  options.outputs.push({
    type: "stream",
    enabled: true,
    config: {
      instance: exportStream
    }
  });
}

module.exports = getFormatter(options);
