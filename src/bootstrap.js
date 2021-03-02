const {
  World,
  Data
} = require('@restqa/restqa-plugin-bootstrap')

const Config = require('./config')
const Logger = require('./utils/logger')

module.exports = function (processor, options) {

  const {
    After, AfterAll, Before, BeforeAll,
    Given, When, Then,
    defineParameterType,
    setWorldConstructor
  } = processor

  const config = new Config(options)
  
  function pluginLoader (plugin) {
    let Module = require(`@restqa/${plugin.name}`)
    if (config.environment.data) {
      plugin.config.data = {
        startSymbol: config.environment.data.startSymbol,
        endSymbol: config.environment.data.endSymbol
      }
    }

    let instance = new Module(plugin.config)
    
    instance.setParameterType(defineParameterType)
    instance.setSteps({ Given, When, Then })
    instance.setHooks({ Before, BeforeAll, After, AfterAll })
    
    let __CLASS_NAME__ = instance.getWorld()
    return new __CLASS_NAME__({})
  }
  
  let Plugins = config
    .environment
    .plugins
    .map(pluginLoader)
  
  
  class RestQA extends World{
    constructor(obj) {
      super(obj)
      let { data, secrets } = config.environment
      this._data = new Data(data)
      if (secrets) {
        Object.keys(secrets).forEach(_ => this._data.set(_, secrets[_]))
      }
      Plugins.forEach(world => world.setup.call(this))
    }
  }
  
  setWorldConstructor(RestQA)
}
