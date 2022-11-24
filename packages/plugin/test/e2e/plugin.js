// Import plugin factory
const PF = require("../../index");

/**
 * AS A USER
 */
const pf = new PF("full-test")
  /**
   *
   * STEPS
   *
   */
  // Given step
  .addGivenStep(
    "Log this {string}",
    function logger(stringToLog) {
      console.log(`Log: ${stringToLog}`);
    },
    "Log something",
    ["log"]
  )
  // When step
  .addWhenStep("I put my hands up", function handsUp() {
    // use config
    const config = this.getConfig(pf.name);
    console.log(`${config.name} puts hands up !`);
  })
  // Then step
  .addThenStep("Print state", function happy() {
    // use state
    const state = this.state;
    console.log("state is", state);
  })
  /**
   *
   * HOOKS
   *
   */
  // Before Hook
  .addBeforeHook(function beforeHook() {
    console.log("before hook");
  })
  .addBeforeHook(
    "@beforeHookWithStringTag",
    function beforeHookWithStringTag() {
      console.log("before hook with string tag");
    }
  )
  .addBeforeHook(
    {tags: "@beforeHookWithObjectTag"},
    function beforeHookWithObjectTag() {
      console.log("before hook with object tag");
    }
  )
  // After Hook
  .addAfterHook(function afterHook() {
    console.log("after hook");
  })
  .addAfterHook("@afterHookWithStringTag", function afterHookWithStringTag() {
    console.log("after hook with string tag");
  })
  .addAfterHook(
    {tags: "@afterHookWithObjectTag"},
    function afterHookWithObjectTag() {
      console.log("after hook with object tag");
    }
  )
  .addBeforeAllHook({timeout: 1000}, function beforeAllHook() {
    console.log("before all hook with timeout");
  })
  .addBeforeAllHook({tags: "@test"}, function beforeAllHook() {
    console.log("before all hook with tags");
  })
  .addBeforeAllHook({tags: "@test", timeout: 1000}, function beforeAllHook() {
    console.log("before all hook with tags and timeout");
  })
  // BeforeAll Hook
  .addBeforeAllHook(function beforeAllHook() {
    console.log("before all hook");
  })
  // AfterAll Hook
  .addAfterAllHook(function afterAllHook() {
    console.log("after all hook");
  })
  /**
   *
   * STATE (World)
   *
   */
  .addState("property", {foo: "bar"});

/**
 * AS A CORE CONTRIBUTOR
 *
 * This little function try to mimic
 * the RestQA bootstrap
 */
function bootstrap() {
  const cucumberInstance = require("@cucumber/cucumber");
  const config = {name: "Tony"};
  pf._commit(cucumberInstance, config);

  class State {
    constructor() {
      this.state = pf._getState();
      this.config = {[pf.name]: pf._getConfig()};
    }

    getConfig(name) {
      return this.config[name];
    }
  }

  cucumberInstance.setWorldConstructor(State);
}

module.exports = bootstrap();
