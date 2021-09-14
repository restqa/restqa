const Config = require("../config");
const Data = require('./data');
const logger = require("../utils/logger");
const path = require("path");

const Module = require("module");

module.exports = function (processor, options = {}) {
  if (
    !processor ||
    !processor.After ||
    !processor.AfterAll ||
    !processor.Before ||
    !processor.BeforeAll ||
    !processor.Given ||
    !processor.When ||
    !processor.Then ||
    !processor.defineParameterType ||
    !processor.setWorldConstructor ||
    !processor.setDefaultTimeout
  ) {
    throw new Error(
      "Please provide a processor containing the methods: After, AfterAll, Before, BeforeAll, Given, When, Then, defineParameterType, setWorldConstructor and setDefaultTimeout."
    );
  }

  const {
    defineParameterType,
    setWorldConstructor
  } = processor;

  const config = new Config(options);
  if (config.restqa && config.restqa.timeout) {
    processor.setDefaultTimeout(config.restqa.timeout);
  }
  logger.info("service.select_environment", config.environment.name);

  // Plugin settings
  const plugins = config
    .environment
    .plugins
    .map((plugin) => {
      const instance = getPluginModule(plugin.name);
      instance._apply(processor, plugin.config);
      options.plugin = plugin._name;
      return instance
    });

  // Data settings
  const {data, secrets} = config.environment;
  const dataInstance = new Data(data);
  if (secrets) {
    Object.keys(secrets).forEach((_) => dataInstance.set(_, secrets[_]));
  }

  const regexp = new RegExp(`${data.startSymbol.replace(/(?=\W)/g, '\\')}(.*)${data.endSymbol.replace(/(?=\W)/g, '\\')}`)
  defineParameterType({
    regexp,
    transformer: function (value) {
      value = `${data.startSymbol} ${value} ${data.endSymbol}`
      return this.data.get(value)
    },
    name: 'data'
  })

  // World settings
  const world = getWorld(plugins, dataInstance);
  setWorldConstructor(world);
};

function getPluginModule(name) {
  // Due to some changes we need to handle retro-compatibility
  if (["restqapi"].includes(name)) {
    name = `@restqa/${name}`;
  }

  let result;
  if (name === "@restqa/restqapi") {
    result = require(name);
  } else {
    result = Module.createRequire(
      path.resolve(process.env.RESTQA_PROJECT_FOLDER || process.cwd(), ".") +
        path.sep
    )(name);
  }

  return result;
}

function getWorld (plugins, data) {
  const states = plugins.reduce((obj, plugin) => {
    obj[plugin._name] = plugin._state
    return obj
  }, {})

  return class {
    constructor() {
      for (const [key, value] of Object.entries(states)) {
        this[key] = value;
      }
      this._data = data
    }

    get data() {
      return this._data;
    }
  }
}
