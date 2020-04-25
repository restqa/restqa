const path = require('path')
const fs = require('fs')

module.exports = function (program) {
  // -- env
  let { env, config, args } = program
  if (env) process.env.RESTQA_ENV = env

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
    console.log(`file not exist : ${config}`)
    process.exit(0)
  }
  process.env.RESTQA_CONFIG = config

  program.restqa = {
    env,
    config,
    paths
  }
}
