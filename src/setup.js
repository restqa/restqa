const {
  After, AfterAll, Before, BeforeAll,
  Given, When, Then,
  defineParameterType,
  setWorldConstructor
} = require('cucumber')


const Config = require('./config')
const Data = require(`./data`)

const restqa = {
  env: process.env.RESTQA_ENV && String(process.env.RESTQA_ENV).toLowerCase(),
  configFile: process.env.RESTQA_CONFIG
}

const config = new Config(restqa)

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
  
  return instance.getWorld()
}

let World = config
  .environment
  .plugins
  .map(pluginLoader)
  /*
  .reduce((r,i) => {
    let props = Object.getOwnPropertyNames(i.prototype)
    props.forEach(prop => {
      if ('constructor' === prop) {
        Object.assign(r.prototype, new (i.prototype[prop])({}))
      } else {
        r.prototype[prop] = i.prototype[prop]
      }
    })
    return  r
  }, class {} )
  */


class RestQA extends World[0] {
  constructor(obj) {
    super(obj)
    let { data, secrets } = config.environment
    this._data = new Data(data)
    if (secrets) {
      Object.keys(secrets).forEach(_ => this._data.set(_, secrets[_]))
    }
  }
}

setWorldConstructor(RestQA)
