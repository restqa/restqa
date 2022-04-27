const fs = require("fs-extra");
const path = require("path");
const URL = require("url");
const open = require("open");
const {getFormatter} = require("@restqa/cucumber-export");
const Welcome = require("../utils/welcome");

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
        folder: "restqa",
        browserOpening: true
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

options.customExporters = {
  html: async function (config, result) {
    // Overriding the buildin html-report from @restqa/cucumber
    const HTML_TEMPLATE_FOLDER = path.resolve(
      __dirname,
      "..",
      "..",
      "dashboard",
      "dist"
    );

    config = config || {};
    if (undefined === config.browserOpening) {
      config.browserOpening = true;
    }
    config.folder = config.folder || path.resolve(process.cwd(), "restqa");

    try {
      fs.copySync(HTML_TEMPLATE_FOLDER, config.folder, {overwrite: true});

      const dataOutput = getDataOutput(result);

      const output = `window.OUTPUT = ${JSON.stringify(
        dataOutput,
        null,
        2
      )}\n\n`;

      fs.writeFileSync(path.resolve(config.folder, "restqa.result.js"), output);

      const url = URL.pathToFileURL(
        path.resolve(config.folder, "index.html")
      ).href;

      config.browserOpening && (await open(url));
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
    RESTQA_POSTMAN;

  if (global.restqa && global.restqa.openapi) {
    RESTQA_SPECIFICATION = global.restqa.openapi;
  }

  return {
    RESTQA_RESULT,
    RESTQA_INTEGRATION,
    RESTQA_PERFORMANCE,
    RESTQA_SPECIFICATION,
    RESTQA_POSTMAN
  };
}

module.exports = getFormatter(options);
