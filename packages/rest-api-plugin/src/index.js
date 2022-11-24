const RestQAPlugin = require("@restqa/plugin");
const RestAPI = require("./rest-api");

const plugin = new RestQAPlugin(RestAPI.name);

// Setup Steps

RestAPI.steps.given.reduce(
  (instance, step) => instance.addGivenStep(...step),
  plugin
);
RestAPI.steps.when.reduce(
  (instance, step) => instance.addWhenStep(...step),
  plugin
);
RestAPI.steps.then.reduce(
  (instance, step) => instance.addThenStep(...step),
  plugin
);

// Setup Hooks
plugin
  .addBeforeAllHook(() => {
    if (plugin._config && plugin._config.url) {
      process.stdout.write("> 🏹 Target url: " + plugin._config.url + "\n");
    }
  })
  .addBeforeHook(RestAPI.hooks.before)
  .addAfterHook(RestAPI.hooks.after);

// Add generator
plugin.Generator = RestAPI.generator;

module.exports = plugin;
