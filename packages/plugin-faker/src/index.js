const RestQAPlugin = require("@restqa/plugin");
const RestQAFaker = require("./faker-plugin");

const instance = new RestQAPlugin(RestQAFaker.name);

RestQAFaker.steps.given
  .reduce((instance, step) => instance.addGivenStep(...step), instance)
  .addBeforeHook(RestQAFaker.hooks.before)
  .addAfterHook(RestQAFaker.hooks.after);

module.exports = instance;
