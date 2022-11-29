const Data = require("./data");
const logger = require("../utils/logger");
const fs = require("fs");
const path = require("path");
const RestQAData = require("@restqa/data");
const CorePlugin = require("./plugin");
const {cwd} = require("../utils/process.js");

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
  const {env, config, isLocalTest} = options;

  if (!config) {
    throw new Error("The configuration is not loaded");
  }

  if (config.getSettings().getTimeout()) {
    processor.setDefaultTimeout(config.getSettings().getTimeout());
  }

  if (
    isLocalTest &&
    (!config.getLocalTest().getPort() || !config.getLocalTest().getCommand())
  ) {
    throw new Error(
      "The local test can't be executed due to missing local test configuration"
    );
  }

  if (!isLocalTest && !config.getIntegrationTests().length) {
    throw new Error(
      "The integration test can't be executed due to missing integration test configuration"
    );
  }

  const environment = {
    name: config.getLocalTest().getName(),
    url: config.getLocalTest().getUrl(),
    data: config.getLocalTest().getData()
  };

  if (env) {
    environment.name = config.getIntegrationTest(env).getName();
    environment.url = config.getIntegrationTest(env).getUrl();
    environment.data = config.getIntegrationTest(env).getData();
  }

  logger.info("service.select_environment", environment.name);

  // Plugin settings
  const RestQAPI = {
    getName: () => "@restqa/plugin-rest-api",
    getConfig: () => ({
      url: environment.url
    })
  };
  let plugins = [RestQAPI].concat(config.getPlugins());
  plugins = plugins.map(getPluginModule(options, processor));

  // Data settings
  const provider = RestQAData(environment.data);
  const dataInstance = new Data(environment.data.toJSON(), provider);
  for (const key in environment.data.getVariables()) {
    dataInstance.set(key, environment.data.getVariables()[key]);
  }
  defineParameterType(buildParameterTypeRegexp(environment.data));

  const customStepFile = path.resolve(cwd, "tests/steps.js");
  if (fs.existsSync(customStepFile)) {
    const customStep = require(customStepFile);
    customStep({
      Given: processor.Given,
      When: processor.When,
      Then: processor.Then
    });
  }

  options.config = config;
  CorePlugin(options, processor);

  // World settings
  const world = getWorld(plugins, dataInstance);
  setWorldConstructor(world);
};

function getPluginModule(options, processor) {
  return function (plugin) {
    const name = plugin.getName();

    let instance;
    if (name === "@restqa/plugin-rest-api") {
      instance = require(name);
    } else {
      instance = Module.createRequire(
        path.resolve(process.env.RESTQA_PROJECT_FOLDER || process.cwd(), ".") +
          path.sep
      )(name);
    }
    options.plugin = instance.name;
    instance._commit(processor, plugin.getConfig());
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
    `${data.getStartSymbol().replace(/(?=\W)/g, "\\")}(.*)${data
      .getEndSymbol()
      .replace(/(?=\W)/g, "\\")}`
  );

  return {
    regexp,
    transformer: function (value) {
      value = `${data.getStartSymbol()} ${value} ${data.getEndSymbol()}`;
      return this.data.get(value);
    },
    name: "data"
  };
}
