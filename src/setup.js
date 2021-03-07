const Cucumber = require('cucumber')
const Bootstrap = require('./bootstrap')



if (global.restqaOptions.env) {
  process.env.RESTQA_ENV = global.restqaOptions.env && String(global.restqaOptions.env).toUpperCase()
}
process.env.RESTQA_CONFIG = global.restqaOptions.config


const options = {
  env: process.env.RESTQA_ENV,
  configFile: process.env.RESTQA_CONFIG
}

Bootstrap(Cucumber, options)
