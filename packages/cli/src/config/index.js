const fs = require("fs");
const YAML = require("yaml");
const Schema = require("./schema");

class Config {
  constructor() {
    this._config = null || {};
  }

  load(filename) {
    if (!fs.existsSync(filename)) {
      throw new ReferenceError(
        `The configuration file located at "${filename}" doesn't exist.`
      );
    }
    const file = fs.readFileSync(filename, "utf8");
    const envVar = {
      identify: (value) => value instanceof RegExp,
      tag: "!env-var",
      resolve(doc, node) {
        const {strValue} = node;
        return (
          process.env[strValue] ||
          `${strValue} not found in the environment variable`
        );
      }
    };

    const config = YAML.parse(file, {customTags: [envVar]});
    Schema.validate(config);
    this._config = config;
    this._config.tests.local = new LocalTest(this._config.tests.local);
    this._config.tests.integrations = (
      this._config.tests.integrations || []
    ).map((_) => new IntegrationTest(_));
    this._config.tests.performance = new PerformanceTest(
      this._config.tests.performance
    );
    this._config.specification = new Specification(this._config.specification);
    this._config.collection = new Collection(this._config.collection);
    this._config.plugins = (this._config.plugins || []).map(
      (_) => new Plugin(_)
    );
    this._config.settings = new Settings(this._config.settings);
  }

  get code() {
    return this._config.metadata.code;
  }

  getName() {
    return this._config.metadata.name;
  }

  setName(name) {
    this._config.metadata = this._config.metadata || {};
    this._config.metadata.name = name;
    this._config.metadata.code = name
      .replace(/[^A-Z0-9]+/gi, "-")
      .toUpperCase();
  }

  getDescription() {
    return (
      this._config.metadata.description ||
      "Delicious Microservice maintained with RestQA"
    );
  }

  setDescription(description) {
    this._config.metadata = this._config.metadata || {};
    this._config.metadata.description = description;
  }

  getLocalTest() {
    this._config.tests = this._config.tests || {};
    this._config.tests.local = this._config.tests.local || new LocalTest();
    return this._config.tests.local;
  }

  getIntegrationTests() {
    return this._config.tests.integrations || [];
  }

  getIntegrationTest(name) {
    const instance = this._config.tests.integrations.find(
      (c) => c.getName().toLowerCase() === name.toLowerCase()
    );
    if (!instance) {
      const list = this._config.tests.integrations.map((_) => _.getName());
      throw new Error(
        `The environment "${name}" doesn't exist. Available: ${list.join(", ")}`
      );
    }
    return instance;
  }

  addIntegration(name, url) {
    const config = {
      name,
      url,
      outputs: []
    };
    this._config.tests = this._config.tests || {};
    this._config.tests.integrations = this._config.tests.integrations || [];
    this._config.tests.integrations.push(new IntegrationTest(config));
  }

  getPerformanceTest() {
    this._config.tests = this._config.tests || {};
    this._config.tests.performance =
      this._config.tests.performance || new PerformanceTest();
    return this._config.tests.performance;
  }

  getSpecification() {
    this._config.specification =
      this._config.specification || new Specification();
    return this._config.specification;
  }

  getCollection() {
    this._config.collection = this._config.collection || new Collection();
    return this._config.collection;
  }

  getPlugins() {
    return this._config.plugins || [];
  }

  getPlugin(name) {
    const instance = this._config.plugins.find(
      (plugin) => plugin.getName().toLowerCase() === name.toLowerCase()
    );
    if (!instance) {
      throw new Error(`The ${name} hasn't been declared.`);
    }
    return instance;
  }

  addPlugin(name, config) {
    this._config.plugins = this._config.plugins || [];
    this._config.plugins.push(
      new Plugin({
        name,
        config
      })
    );
  }

  getSettings() {
    this._config.settings = this._config.settings || new Settings();
    return this._config.settings;
  }

  toJSON() {
    const obj = {
      version: "0.0.1",
      metadata: {
        code: this.code,
        name: this.getName(),
        description: this.getDescription()
      },
      tests: {}
    };

    if (!this.getLocalTest().isEmpty()) {
      obj.tests.local = this.getLocalTest().toJSON();
    }

    if (this.getIntegrationTests().length) {
      obj.tests.integrations = this.getIntegrationTests().map((integration) =>
        integration.toJSON()
      );
    }

    if (!this.getPerformanceTest().isEmpty()) {
      obj.tests.performance = this.getPerformanceTest().toJSON();
    }

    if (!this.getSpecification().isEmpty()) {
      obj.specification = this.getSpecification().toJSON();
    }

    if (!this.getCollection().isEmpty()) {
      obj.collection = this.getCollection().toJSON();
    }

    if (this.getPlugins().length) {
      obj.plugins = this.getPlugins().map((plugin) => plugin.toJSON());
    }

    if (!this.getSettings().isEmpty()) {
      obj.settings = this.getSettings().toJSON();
    }
    return obj;
  }

  toYAML() {
    return YAML.stringify(this.toJSON());
  }

  save(filename) {
    const contentYAML = YAML.stringify(this.toJSON(), null, {
      directivesEndMarker: true
    });
    fs.writeFileSync(filename, contentYAML);
  }
}

class LocalTest {
  constructor(config) {
    this._config = config || {};
    if (this._config.data) {
      this._config.data = new Data(this._config.data);
    }
  }

  getName() {
    return "local";
  }

  getUrl() {
    return `http://127.0.0.1:${this._config.port}`;
  }

  getPort() {
    return this._config.port;
  }

  setPort(port) {
    this._config.port = port;
  }

  getCommand() {
    return this._config.command;
  }

  setCommand(command) {
    this._config.command = command;
  }

  getEnvs() {
    return this._config.envs || {};
  }

  setEnvs(value) {
    this._config.envs = value;
  }

  getCoverage() {
    return this._config.coverage;
  }

  setCoverage(value) {
    this._config.coverage = value;
  }

  getData() {
    if (!this._config.data) {
      this._config.data = new Data();
    }
    return this._config.data;
  }

  toJSON() {
    const obj = {
      ...this._config
    };
    if (obj.data) {
      obj.data = this._config.data.toJSON();
    }
    return obj;
  }

  isEmpty() {
    return Object.keys(this._config).length === 0;
  }
}

class IntegrationTest {
  constructor(config) {
    this._config = config || {};
    if (this._config.data) {
      this._config.data = new Data(this._config.data);
    }
  }

  getName() {
    return this._config.name;
  }

  getUrl() {
    return this._config.url;
  }

  getOutputs() {
    return this._config.outputs;
  }

  addOutput(output) {
    this._config.outputs = this._config.outputs || [];
    this._config.outputs.push(output);
  }

  getData() {
    if (!this._config.data) {
      this._config.data = new Data();
    }
    return this._config.data;
  }

  toJSON() {
    return {
      ...this._config,
      data: this._config.data && this._config.data.toJSON()
    };
  }

  isEmpty() {
    return Object.keys(this._config).length === 0;
  }
}

class PerformanceTest {
  constructor(config) {
    this._config = config || {};
  }

  getTool() {
    return this._config.tool;
  }

  setTool(tool) {
    this._config.tool = tool;
  }

  getOutputFolder() {
    return this._config.outputFolder;
  }

  setOutputFolder(val) {
    this._config.outputFolder = val;
  }

  isOnlySuccess() {
    return this._config.onlySuccess;
  }

  setOnlySuccess(val) {
    this._config.onlySuccess = val;
  }

  toJSON() {
    return this._config;
  }

  isEmpty() {
    return Object.keys(this._config).length === 0;
  }
}

class Specification {
  constructor(config) {
    this._config = config || {};
  }

  setTool(val) {
    this._config.tool = val;
  }

  getTool() {
    return this._config.tool;
  }

  getTitle() {
    return this._config.title;
  }

  setTitle(val) {
    this._config.title = val;
  }

  getDescription() {
    return this._config.description;
  }

  setDescription(val) {
    this._config.description = val;
  }

  toJSON() {
    return this._config;
  }

  isEmpty() {
    return Object.keys(this._config).length === 0;
  }
}

class Collection {
  constructor(config) {
    this._config = config || {};
  }

  getTool() {
    return this._config.tool;
  }

  setTool(val) {
    this._config.tool = val;
  }

  getExportFile() {
    return this._config.exportFile;
  }

  setExportFile(val) {
    this._config.exportFile = val;
  }

  toJSON() {
    return this._config;
  }

  isEmpty() {
    return Object.keys(this._config).length === 0;
  }
}

class Plugin {
  constructor(config) {
    this._config = config || {};
  }

  getName() {
    return this._config.name;
  }

  getConfig() {
    return this._config.config;
  }

  toJSON() {
    return this._config;
  }

  isEmpty() {
    return Object.keys(this._config).length === 0;
  }
}

class Data {
  constructor(config) {
    this._config = config || {};
  }

  getStorage() {
    return this._config.storage;
  }

  setStorage(val) {
    this._config.storage = val;
  }

  getChannel() {
    return this._config.channel;
  }

  setChannel(val) {
    this._config.channel = val;
  }

  getConfig() {
    return this._config.config;
  }

  setConfig(val) {
    this._config.config = val;
  }

  getStartSymbol() {
    return this._config.startSymbol || "{{";
  }

  setStartSymbol(val) {
    this._config.startSymbol = val;
  }

  getEndSymbol() {
    return this._config.endSymbol || "}}";
  }

  setEndSymbol(val) {
    this._config.endSymbol = val;
  }

  getVariables() {
    return this._config.variables || {};
  }

  addVariables(key, val) {
    this._config.variables = this._config.variables || {};
    this._config.variables[key] = val;
  }

  toJSON() {
    return this._config;
  }

  isEmpty() {
    return Object.keys(this._config).length === 0;
  }
}

class Settings {
  constructor(config) {
    this._config = config || {};
  }

  getTimeout() {
    return this._config.timeout;
  }

  setTimeout(val) {
    this._config.timeout = val;
  }

  getTips() {
    return this._config.tips || {};
  }

  toJSON() {
    return this._config;
  }

  isEmpty() {
    return Object.keys(this._config).length === 0;
  }
}

module.exports = Config;
