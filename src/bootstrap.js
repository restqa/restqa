const {
  World,
  Data
} = require('@restqa/restqa-plugin-bootstrap')

const Config = require('./config')

module.exports = function (processor, options) {
  const {
    After, AfterAll, Before, BeforeAll,
    Given, When, Then,
    defineParameterType,
    setWorldConstructor
  } = processor

  const config = new Config(options)

  function pluginLoader (plugin) {
    options.plugin = `@restqa/${plugin.name}`
    const Module = require(options.plugin)
    if (config.environment.data) {
      plugin.config.data = {
        startSymbol: config.environment.data.startSymbol,
        endSymbol: config.environment.data.endSymbol
      }
    }

    const instance = new Module(plugin.config)

    instance.setParameterType(defineParameterType)
    instance.setSteps({ Given, When, Then })
    instance.setHooks({ Before, BeforeAll, After, AfterAll })

    const __CLASS_NAME__ = instance.getWorld()
    return new __CLASS_NAME__({})
  }

  const Plugins = config
    .environment
    .plugins
    .map(pluginLoader)

  class RestQA extends World {
    constructor (obj) {
      super(obj)
      const { data, secrets } = config.environment
      this._data = new Data(data)
      if (secrets) {
        Object.keys(secrets).forEach(_ => this._data.set(_, secrets[_]))
      }
      Plugins.forEach(world => world.setup.call(this))
    }
  }

  setWorldConstructor(RestQA)
}
