const path = require('path')
const fs = require('fs')
const cucumber = require('cucumber')
const logger = require('../utils/logger')

module.exports = function (program) {
  let {
    env,
    config,
    tags = [],
    stream = process.stdout,
    args = []
  } = program

  const invalidTags = tags.filter(tag => tag.substr(0, 1) !== '@')
  if (invalidTags.length) {
    return Promise.reject(new Error(`The tags should start with the symbol "@" (example: @${invalidTags[0]})`))
  }

  const currentPathGlob = path.resolve('.', '{*.feature,!(node_modules)', '**', '*.feature}')

  let paths = args.map(_ => path.resolve(_))

  if (paths.length === 1) {
    const isFolder = fs.lstatSync(paths[0]).isDirectory()
    if (isFolder) {
      const configFile = path.join(paths[0], '.restqa.yml')
      if (!config && fs.existsSync(configFile)) {
        config = configFile
      }
    }
  }

  paths = paths.map(p => {
    return p.replace(new RegExp(`^${path.resolve('.')}$`), currentPathGlob)
  })

  if (!paths.length) paths.push(currentPathGlob)

  // -- config
  config = config || path.join(process.cwd(), '.restqa.yml')
  if (!fs.existsSync(config)) {
    return Promise.reject(new Error(`The configuration file "${config}" doesn't exist.`))
  }

  global.restqaOptions = {
    config,
    env
  }

  // TODO : Add extra cucumber parameters from config file
  const customOptions = [
    'node',
    'cucumber-js',
    '--require',
    '../src/setup.js',
    '--format',
    '../src/restqa-formatter:.restqa.log',
    '--format-options',
    '{"snippetSyntax": "../src/restqa-snippet.js"}'
  ]

  if (tags) {
    tags.forEach(tag => {
      customOptions.push('--tags')
      customOptions.push(tag)
    })
  }

  const options = {
    argv: customOptions.concat(paths),
    cwd: path.join(__dirname, '../'),
    stdout: stream
  }

  const cucumberCli = new cucumber.Cli(options)

  return cucumberCli.run()
    .then(result => {
      const exitCode = result.success ? 0 : 1
      if (result.shouldExitImmediately) {
        process.exit(exitCode)
      } else {
        process.exitCode = exitCode
      }
    })
    .catch(err => {
      logger.error(err)
      process.exit(1)
    })
}
