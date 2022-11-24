// Node.js dependencies
const path = require("path");
const {stdout} = require("process");

// Third-party dependencies
const cucumberInstance = require("@cucumber/cucumber");

function successHandler({success}) {
  if (success === false) {
    console.log("E2E tests failed!");
    process.exit(1);
  }
  console.log("E2E tests passed!");
}

function errorHandler(err) {
  console.log("E2E tests failed!");
  console.log(err);
  process.exit(1);
}

function runTest() {
  const cli = new cucumberInstance.Cli({
    argv: ["node", "cucumber-js", "--require", "plugin.js"],
    cwd: path.join(__dirname),
    stdout
  });

  return cli.run().then(successHandler, errorHandler);
}

runTest();
