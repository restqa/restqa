const RestQAPlugin = require("@restqa/plugin");
const RestQAPI = require("./restqapi");

const plugin = new RestQAPlugin(RestQAPI.name);

// Setup Steps

RestQAPI.steps.given.reduce(
  (instance, step) => instance.addGivenStep(...step),
  plugin
);
RestQAPI.steps.when.reduce(
  (instance, step) => instance.addWhenStep(...step),
  plugin
);
RestQAPI.steps.then.reduce(
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
  .addBeforeHook(RestQAPI.hooks.before)
  .addAfterHook(RestQAPI.hooks.after);

// Add generator
plugin.Generator = RestQAPI.generator;

module.exports = plugin;
