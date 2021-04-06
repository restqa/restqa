const fs = require('fs')
const Path = require('path')
const YAML = require('yaml')
const Schema = require('./schema')

function Config ({ env, configFile }) {
  if (!fs.existsSync(configFile)) {
    throw new Error(`THE RESTQA CONFIG FILE IS MISSING (${configFile})`)
  }

  const envVar = {
    identify: value => value instanceof RegExp,
    tag: '!env-var',
    resolve (doc, node) {
      const { strValue } = node
      return process.env[strValue] || `${strValue} not found in the environment variable`
    }
  }

  const file = fs.readFileSync(configFile, 'utf8')
  const config = YAML.parse(file, { customTags: [envVar] })
  const envs = config.environments.map(env => env.name)

  if (!env) {
    env = (config.environments.find(e => e.default) || {}).name
  }

  if (!env && envs.length === 1) {
    env = envs[0]
  }

  env = String(env).toLowerCase()

  if (!env || !envs.map(_ => _.toLowerCase()).includes(env)) {
    throw new Error(`THE ENVIRONMENT NEEDS TO BE DEFINED AS (${envs.join(' | ')})`)
  }

  config.environment = config.environments.find(e => env === e.name.toLowerCase())

  delete config.environments

  return Schema.validate(config)
}

Config.locate = function (options) {
  let { configFile, path } = options || {}
  let fileName = '.restqa.yml'
  let filePath = Path.join(process.cwd(), fileName)
  let parsed
  if (configFile) {
    parsed = Path.parse(configFile)
    if (!parsed.dir) {
      parsed.dir = process.cwd()
      parsed.root = '/'
    }
    filePath = Path.format(parsed)
  }

  if (path) {
    path = Path.resolve(path)
    const isFolder = fs.lstatSync(path).isDirectory()
    if (!isFolder) {
      throw new ReferenceError(`The path "${path}" is not a folder`)
    }
    if (configFile && parsed) {
      fileName = parsed.base
    }
    filePath = Path.join(path, fileName)
  }

  if (!fs.existsSync(filePath)) {
    throw new ReferenceError(`The configuration file "${filePath}" doesn't exist."`)
  }

  return filePath
}

module.exports = Config
