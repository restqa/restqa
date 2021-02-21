const {
  After, AfterAll, Before, BeforeAll,
  Given, When, Then,
  defineParameterType,
  setWorldConstructor
} = require('cucumber')


const {
  World,
  Data
} = require('@restqa/restqa-plugin-boostrap')

const Config = require('./config')
const Logger = require('./utils/logger')

try {

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

  
  const dataPrivacyWarningOutput = ['http-html-report']
  config.environment.outputs
    .filter(_ => dataPrivacyWarningOutput.includes(_.type))
    .forEach(output => {
      if ('http-html-report' === output.type && !output.config) {
        const msg = [
          `🔥 [DATA PRIVACY WARNING] The output "http-html-report" is configured with the default option.`,
          `The report will be automatically stored on the public RestQA dashboard for only 2 minutes.`,
          `This mode will be enabled for demo purposes only. It should be used with your real scenarios.`,
          `We are recommending you two other options for you:`,
          `👉 Disable the http-html-report output`,
          `👉 Configure the http-html-report to a custom url pointing to the @restqa/sidekick-server hosted on your infrastructure (project: https://github.com/restqa/sidekick-server)`,
          `---`,
          `More documentation about http-html-report at https://docs.restqa.io/monitoring/http-html-report`,
          `\n\n`
        ]
        Logger.warning(msg.join('\n'))
      }
    })
} catch(err) {
  //throw err
  console.log(err)
  process.exit(1)
}
