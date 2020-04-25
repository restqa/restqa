const { getFormatter } = require('@restqa/cucumber-export')
const Config = require('./config')

const restqa = {
  env: process.env.RESTQA_ENV && String(process.env.RESTQA_ENV).toLowerCase(),
  configFile: process.env.RESTQA_CONFIG
}

const config = new Config(restqa)

const options = {
  key: config.code,
  name: config.name,
  env: config.environment.name,
  outputs: config.environment.outputs
}

module.exports = getFormatter(options)
