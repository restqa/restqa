const Config = require("../config");
const Data = require("./data");
const logger = require("../utils/logger");
const path = require("path");
const RestQAData = require("@restqa/restqdata");
const CorePlugin = require("./plugin");

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

  const {defineParameterType, setWorldConstructor} = processor;

  const config = new Config(options);
  if (config.restqa && config.restqa.timeout) {
    processor.setDefaultTimeout(config.restqa.timeout);
  }
  logger.info("service.select_environment", config.environment.name);

  // Plugin settings
  const plugins = config.environment.plugins.map(
    getPluginModule(options, processor)
  );

  // Data settings
  const {data, secrets} = config.environment;
  const provider = RestQAData(data);
  const dataInstance = new Data(data, provider);
  if (secrets) {
    Object.keys(secrets).forEach((_) => dataInstance.set(_, secrets[_]));
  }
  defineParameterType(buildParameterTypeRegexp(data));

  options.config = config;
  CorePlugin(options, processor);

  // World settings
  const world = getWorld(plugins, dataInstance);
  setWorldConstructor(world);
};

function getPluginModule(options, processor) {
  return function (plugin) {
    let {name} = plugin;

    // Due to some changes we need to handle retro-compatibility
    if (["restqapi"].includes(name)) {
      name = `@restqa/${name}`;
    }

    let instance;
    if (name === "@restqa/restqapi") {
      instance = require(name);
    } else {
      instance = Module.createRequire(
        path.resolve(process.env.RESTQA_PROJECT_FOLDER || process.cwd(), ".") +
          path.sep
      )(name);
    }
    options.plugin = instance.name;
    instance._commit(processor, plugin.config);
    return instance;
  };
}

function getWorld(plugins, data) {
  const states = plugins.reduce((obj, plugin) => {
    return Object.assign(obj, plugin._getState());
  }, {});

  const config = plugins.reduce((obj, plugin) => {
    obj[plugin.name] = plugin._config;
    return obj;
  }, {});

  return class {
    constructor({attach, parameters}) {
      for (const [key, value] of Object.entries(states)) {
        this[key] = value;
      }

      this.attach = attach;
      this.parameters = parameters;
      this._data = data;
      this._config = config;
      this.state = states;
    }

    get data() {
      return this._data;
    }

    set log(value) {
      this._log = value;
    }

    get log() {
      return this._log || console.log; // eslint-disable-line no-console
    }

    getConfig(pluginName) {
      return this._config[pluginName];
    }
  };
}

function buildParameterTypeRegexp(data) {
  const regexp = new RegExp(
    `${data.startSymbol.replace(/(?=\W)/g, "\\")}(.*)${data.endSymbol.replace(
      /(?=\W)/g,
      "\\"
    )}`
  );

  return {
    regexp,
    transformer: function (value) {
      value = `${data.startSymbol} ${value} ${data.endSymbol}`;
      return this.data.get(value);
    },
    name: "data"
  };
}
