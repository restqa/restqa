const RestQAPlugin = require("@restqa/plugin");
const RestQAFaker = require("./faker-plugin");

const instance = new RestQAPlugin(RestQAFaker.name);

module.exports = instance.addBeforeHook(RestQAFaker.hooks.before);
