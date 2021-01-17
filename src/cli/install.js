const Config = require('../config')
const YAML = require('yaml')
const fs = require('fs')
const inquirer = require('inquirer')
const logger = require('../utils/logger')

const LIST = {
  'slack' : {
    type: 'outputs',
    questions: [{
      name: 'config_url',
      message: `What is the slack incoming webhook url?`
    }],
    get: (config) => {
      if (!config.url) {
        throw new Error('Please specify the slack incoming webhook url')
      }
      return {
        type: 'slack',
        enabled: true,
        config: {
          url: config.url,
          onlyFailed: false
       }
     }
    }
  }
}

async function Install (name, program) {

  if (name && !LIST[name]) {
    throw new Error(`The plugin "${name}" is not available. Use the command "restqa install" to retrive the list of available plugin`)
  }

  const questions = []

  const configFile = Config.locate()
  const restqaConfig = YAML.parse(fs.readFileSync(configFile).toString('utf-8'))
  const env = restqaConfig.environments[0].name

  if (!name) {
    name = (await inquirer.prompt([{
      type: 'list',
      message: `What do you want to install?`,
      name: 'name',
      choices: Object.keys(LIST).map(key => {
        return {
          name: `${key} (${LIST[key].type})`,
          value: key
        }
      })
    }])).name
  }

  if (restqaConfig.environments.length > 1) {

    message = `On which environment would you like to install the "${name}" ${LIST[name].type}?`

    questions.push({
      type: 'list',
      name: 'env',
      message,
      choices: restqaConfig.environments.map(env => env.name),
    })
  }

  Array.prototype.push.apply(questions, LIST[name].questions)

  const answers = await inquirer.prompt(questions)
  answers.env = answers.env || env
  answers.name = name
  answers.configFile = configFile
  answers.config = Object.keys(answers).reduce((r, key) => {
    if (key.match(/^config_(.*)$/)) {
      r[key.split('_').slice(1)] = answers[key]
    }
    return r
  }, {})

  let result = Install.generate(answers)
  fs.writeFileSync(configFile, result)

  logger.success(`The "${name}" ${LIST[name].type} has been configured successfully`)
  logger.info('Do not forget to use environment variable to secure your sensitive information')
}


Install.generate = function(options) {

  options.config = options.config || {}

  const {
    name,
    env,
    configFile,
    config
  } = options

  const plugin = LIST[name]

  if (!plugin) {
    throw new Error(`The plugin "${name}" is not available. Use the command "restqa install" to retrive the list of available plugin`)
  }

  if (!env) {
    throw new Error(`Please specify the target environment`)
  }

  if (!configFile) {
    throw new Error(`Please specify the location of the configuration file`)
  }

  if (!fs.existsSync(configFile)) {
    throw new Error(`The config file "${configFile}" doesn't exists`)
  }


  const restqaConfig = YAML.parse(fs.readFileSync(configFile).toString('utf-8'))
  const envIndex = restqaConfig.environments.findIndex(_ => _.name == env)

  if (-1 == envIndex) {
    throw new Error(`"${env}" is not an environment available in the config file, choose between : ${restqaConfig.environments.map(_ => _.name).join(', ')}`)
  }

  restqaConfig.environments[envIndex][plugin.type].push(plugin.get(config))

  return YAML.stringify(restqaConfig)
}


module.exports = Install
