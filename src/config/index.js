const fs = require('fs')
const YAML = require('yaml')
const Schema = require('./schema')

module.exports = function ({ env, configFile }) {
  if (!fs.existsSync(configFile)) {
    console.log(`THE RESQA CONFIG FILE IS MISSING (${configFile})`)
  }

  const envVar = {
    identify: value => value instanceof RegExp,
    tag: '!env-var',
    resolve(doc, node) {
      let { strValue } = node
      return process.env[strValue] || `${strValue} not found in the environment variable`
    }
  }

  const file = fs.readFileSync(configFile, 'utf8')
  const config = YAML.parse(file, { customTags: [envVar] })
  const envs = config.environments.map(env => env.name)

  if (!env) {
    env = (config.environments.find(e => e.default) || {}).name
  }

  if (!env || !envs.includes(env)) {
    throw new Error(`THE ENVIRONMENT NEEDS TO BE DEFINED AS (${envs.join(' | ')})`)
  }

  config.environment = config.environments.find(e => env === e.name.toLowerCase())

  delete config.environments

  return Schema.validate(config)
}
