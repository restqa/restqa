const Config = require('../config')
const YAML = require('yaml')
const fs = require('fs')
const inquirer = require('inquirer')
const logger = require('../utils/logger')

const LIST = {
  slack: {
    type: 'outputs',
    questions: [{
      name: 'config_url',
      message: 'What is the slack incoming webhook url?'
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
  },
  discord: {
    type: 'outputs',
    questions: [{
      name: 'config_url',
      message: 'What is the discord incoming webhook url?'
    }],
    get: (config) => {
      if (!config.url) {
        throw new Error('Please specify the discord incoming webhook url')
      }
      return {
        type: 'discord',
        enabled: true,
        config: {
          url: config.url,
          onlyFailed: false
        }
      }
    }
  },
  line: {
    type: 'outputs',
    questions: [{
      name: 'config_token',
      message: 'What is the notification Line Messenger token?'
    }],
    get: (config) => {
      if (!config.token) {
        throw new Error('Please specify the Line notification token')
      }
      return {
        type: 'line',
        enabled: true,
        config: {
          token: config.token,
          onlyFailed: false
        }
      }
    }
  },
  html: {
    type: 'outputs',
    questions: [],
    get: () => {
      return {
        type: 'html',
        enabled: true
      }
    }
  },
  file: {
    type: 'outputs',
    questions: [],
    get: () => {
      return {
        type: 'file',
        enabled: true
      }
    }
  },
  'http-html-report': {
    type: 'outputs',
    questions: [],
    get: () => {
      return {
        type: 'http-html-report',
        enabled: true
      }
    }
  },
  excel: {
    type: 'data',
    questions: [{
      name: 'config_folder',
      message: 'Where are located your csv files ?'
    }],
    get: (config) => {
      if (!config.folder) {
        throw new Error('Please specify the location of your csv files (data.config.folder)')
      }

      if (!fs.existsSync(config.folder)) {
        throw new Error(`The folder "${config.folder}" doesn't exist.`)
      }

      return {
        channel: 'csv',
        config: {
          folder: config.folder
        }
      }
    }
  },
  'google-sheet': {
    type: 'data',
    questions: [{
      name: 'config_id',
      message: 'What is your Google Sheet id?'
    }, {
      name: 'config_apikey',
      message: 'What is your Google Sheet api key?'
    }],
    get: (config) => {
      if (!config.id) {
        throw new Error('Please specify the google sheet id (data.config.id)')
      }

      if (!config.apikey) {
        throw new Error('Please specify the google sheet api key (data.config.apikey)')
      }

      return {
        channel: 'google-sheet',
        config: {
          id: config.id,
          apikey: config.apikey
        }
      }
    }
  }
}

async function Install (name, program) {
  program = program || {}

  let {
    config,
    env
  } = program

  if (name && !LIST[name]) {
    throw new Error(`The plugin "${name}" is not available. Use the command "restqa install" to retrive the list of available plugin`)
  }

  const questions = []

  const configFile = Config.locate({ configFile: config })
  const restqaConfig = YAML.parse(fs.readFileSync(configFile).toString('utf-8'))
  const envs = restqaConfig.environments.map(env => env.name)

  if (!name) {
    const filteredList = Object.keys(LIST).reduce((result, key) => {
      result[LIST[key].type] = result[LIST[key].type] || []
      result[LIST[key].type].push(key)
      return result
    }, {})

    name = (await inquirer.prompt([{
      type: 'list',
      message: 'What do you want to install?',
      name: 'name',
      choices: Object.values(filteredList).map(list => {
        const _list = list.map(key => {
          return {
            name: `${key.charAt(0).toUpperCase() + key.slice(1)} (${LIST[key].type})`,
            value: key
          }
        })
        _list.push(new inquirer.Separator())
        return _list
      }).flat().slice(0, -1)
    }])).name
  }

  if (!env) {
    if (restqaConfig.environments.length > 1) {
      questions.push({
        type: 'list',
        name: 'env',
        message: `On which environment would you like to install the "${name}" ${LIST[name].type}?`,
        choices: envs
      })
    } else {
      env = restqaConfig.environments[0].name
    }
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

  const result = Install.generate(answers)
  fs.writeFileSync(configFile, result)

  logger.success('service.install.success.config_updated', name, LIST[name].type)
  logger.info('service.install.success.credential_warning')
}

Install.generate = function (options) {
  options.config = options.config || {}

  const {
    name,
    env,
    configFile,
    config
  } = options

  const plugin = LIST[name]

  if (!plugin) {
    throw new TypeError(`The plugin "${name}" is not available. Use the command "restqa install" to retrive the list of available plugin`)
  }

  if (!env) {
    throw new TypeError('Please specify the target environment')
  }

  if (!configFile) {
    throw new Error('Please specify the location of the configuration file')
  }

  if (!fs.existsSync(configFile)) {
    throw new Error(`The config file "${configFile}" doesn't exists`)
  }

  const restqaConfig = YAML.parse(fs.readFileSync(configFile).toString('utf-8'))
  const envIndex = restqaConfig.environments.findIndex(_ => _.name === env)

  if (envIndex === -1) {
    throw new TypeError(`"${env}" is not an environment available in the config file, choose between : ${restqaConfig.environments.map(_ => _.name).join(', ')}`)
  }

  if (plugin.type === 'outputs') {
    restqaConfig.environments[envIndex].outputs = restqaConfig.environments[envIndex].outputs || []
    restqaConfig.environments[envIndex].outputs.push(plugin.get(config))
  }

  if (plugin.type === 'data') {
    restqaConfig.environments[envIndex].data = plugin.get(config)
  }

  return YAML.stringify(restqaConfig)
}

module.exports = Install
