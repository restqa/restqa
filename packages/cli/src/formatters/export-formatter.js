const Welcome = require("../utils/welcome");
const Pkg = require("../../package.json");
const path = require("path");
const {getFormatter} = require("@restqa/cucumber-export");
const Report = require("@restqa/report-ui");

const {restqa} = global;
const {config, env, report, exportStream} = restqa;

const msg = new Welcome(config.getSettings().getTips());

let title = "Exporting the test result...";
title = msg.text || title;

const test = {
  name: config.getLocalTest().getName(),
  outputs: [
    {
      type: "html",
      enabled: report,
      config: {
        folder: "restqa",
        browserOpening: true
      }
    }
  ]
};

if (!restqa.isLocalTest()) {
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

options.customExporters = {
  html: async function (config, result) {
    try {
      const options = {
        browserOpening: config.browserOpening,
        dataOutput: getDataOutput(result),
        folder: config.folder,
        includeFiles: [path.resolve(process.cwd(), "tests")]
      };

      const url = await Report(options);

      return Promise.resolve(
        `[HAPPY REPORT][SUCCESS] - Your report has been generated at ${url}`
      );
    } catch (e) {
      return Promise.reject(
        new Error(`[HAPPY REPORT][ERROR] - ${config.folder} : ${e.message}`)
      );
    }
  }
};

function getDataOutput(RESTQA_RESULT) {
  let RESTQA_SPECIFICATION,
    RESTQA_INTEGRATION,
    RESTQA_PERFORMANCE,
    RESTQA_COLLECTION,
    RESTQA_HTTP_MOCKS,
    RESTQA_COVERAGE,
    RESTQA_CONTRIBUTORS;

  if (global.restqa && global.restqa.specification) {
    RESTQA_SPECIFICATION = global.restqa.specification;
  }

  if (global.restqa && global.restqa.contributors) {
    RESTQA_CONTRIBUTORS = global.restqa.contributors;
  }

  if (global.restqa && global.restqa.performance) {
    RESTQA_PERFORMANCE = global.restqa.performance;
  }

  if (global.restqa && global.restqa.httpMock) {
    RESTQA_HTTP_MOCKS = global.restqa.httpMock;
  }

  if (global.restqa && global.restqa.collection) {
    RESTQA_COLLECTION = global.restqa.collection;
  }

  if (global.restqa && global.restqa.coverage) {
    RESTQA_COVERAGE = global.restqa.coverage.filename;
  }

  return {
    RESTQA_FOLDER: process.cwd(),
    RESTQA_RESULT,
    RESTQA_INTEGRATION,
    RESTQA_PERFORMANCE,
    RESTQA_SPECIFICATION,
    RESTQA_COLLECTION,
    RESTQA_CONTRIBUTORS,
    RESTQA_CONFIG: config,
    RESTQA_HTTP_MOCKS,
    RESTQA_COVERAGE,
    RESTQA_VERSION: Pkg.version
  };
}

module.exports = getFormatter(options);
