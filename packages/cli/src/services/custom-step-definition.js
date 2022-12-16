const {cwd} = require("../utils/process.js");
const path = require("path");
const fs = require("fs");

const FILE_NAME = "custom-steps.cjs";
const TEMPLATE = `
module.exports = function ({ Given, When, Then }) {

  /*
  Given ('add a custom header', function () { //Sample of a custom Given step definition
    this.api.request.setHeader('x-custom', 12345)
  })
  */

  /*
  When ('erase request body', function () {  //Sample of a custom When step definition
    this.api.setPayload({})
  })
  */

  /*
  Then ('status ok', function () { // Sample of a custom Then step definition 
    if (String(this.api.response.statusCode).charAt(0) !== '2') {
      throw new Error('The status code is not equal ok')
    }
  })
  */
}
`.trim();

function createTemplate(folder) {
  fs.writeFileSync(path.resolve(folder, FILE_NAME), TEMPLATE);
}

function load(processor) {
  const customStepFile = path.resolve(cwd, "tests", FILE_NAME);

  if (fs.existsSync(customStepFile)) {
    const customStep = require(customStepFile);
    customStep({
      Given: processor.Given,
      When: processor.When,
      Then: processor.Then
    });
  }
}

module.exports = {
  createTemplate,
  load,
  CUSTOM_STEP_TEMPLATE: TEMPLATE,
  CUSTOM_STEP_FILE_NAME: FILE_NAME
};
