const RestQAPlugin = require("@restqa/plugin");
const RestQAFaker = require("./faker-plugin/index.cjs");

const instance = new RestQAPlugin(RestQAFaker.name);

module.exports = instance.addBeforeHook(RestQAFaker.hooks.before);
