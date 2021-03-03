const path = require('path')
const fs = require('fs')
const cucumber = require('cucumber')
const logger = require('../utils/logger')

module.exports = function (program) {
  let {
    env,
    config,
    stdout = process.stdout,
    args = []
  } = program

  // -- paths
  if (!args.length) args.push('.')

  const paths = args.map(_ => path.resolve(_))

  if (paths.length === 1) {
    const isFolder = fs.lstatSync(paths[0]).isDirectory()
    if (isFolder) {
      const configFile = path.join(paths[0], '.restqa.yml')
      if (!config && fs.existsSync(configFile)) {
        config = configFile
      }
    }
  }

  // -- config
  config = config || path.join(process.cwd(), '.restqa.yml')
  if (!fs.existsSync(config)) {
    return Promise.reject(new Error(`The configuration file "${config}" doesn't exit.`))
  }

  global.restqaOptions = {
    config,
    env
  }
  
  // TODO : Add extra cucumber parameters from config file
  let customOptions = [
    'node',
    'cucumber-js',
    '--require',
    '../src/setup.js',
    '--format',
    '../src/restqa-formatter:.restqa.log',
    '--format-options',
    '{"snippetSyntax": "../src/restqa-snippet.js"}'
  ]
  
  const options  = {
    argv: customOptions.concat(paths),
    cwd: path.join(__dirname, '../'),
    stdout
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
      logger.error(err) // eslint-disable-line no-console
      process.exit(1)
    })
}
