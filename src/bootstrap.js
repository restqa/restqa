const {
  World,
  Data
} = require('@restqa/restqa-plugin-bootstrap')

const Config = require('./config')
const logger = require('./utils/logger')
const path = require('path')

const Module = require('module')

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
    throw new Error('Please provide a processor containing the methods: After, AfterAll, Before, BeforeAll, Given, When, Then, defineParameterType, setWorldConstructor and setDefaultTimeout.')
  }

  const {
    After, AfterAll, Before, BeforeAll,
    Given, When, Then,
    defineParameterType,
    setWorldConstructor
  } = processor

  const parameterTypes = []
  const config = new Config(options)
  if (config.restqa && config.restqa.timeout) {
    processor.setDefaultTimeout(config.restqa.timeout)
  }
  logger.info('service.select_environment', config.environment.name)

  function pluginLoader (plugin) {
    options.plugin = plugin.name
    const Plugin = getPluginModule(plugin.name)
    if (config.environment.data) {
      plugin.config.data = {
        startSymbol: config.environment.data.startSymbol,
        endSymbol: config.environment.data.endSymbol
      }
    }

    const instance = new Plugin(plugin.config)

    instance.setParameterType((el) => {
      if (parameterTypes.includes(el.name)) return
      defineParameterType(el)
      parameterTypes.push(el.name)
    })
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

function getPluginModule (name) {
  // Due to some changes we need to handle retro-compatibility
  if (['restqapi'].includes(name)) {
    name = `@restqa/${name}`
  }

  let result
  if (name === '@restqa/restqapi') {
    result = require(name)
  } else {
    result = Module.createRequire(path.resolve(process.env.RESTQA_PROJECT_FOLDER || process.cwd(), '.') + path.sep)(name)
  }

  return result
}
