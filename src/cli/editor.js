const fs = require('fs')
const path = require('path')
const http = require('http')
const logger = require('../utils/logger')
const EditorServer = require('../../editor/server')

module.exports = function (program) {
  let {
    port = 8081,
    config
  } = program

  if (isNaN(port)) {
    throw new Error('The port should be a number. (example: 8081)')
  }

  if (!config) {
    config = path.resolve(process.cwd(), '.restqa.yml')
  }

  if (!fs.existsSync(config)) {
    throw new Error(`The configuration file "${config}" doesn't exist.`)
  }

  return http.createServer(EditorServer(config))
    .listen(port, err => {
      if (err) throw err
      logger.info(`📝  The configuration file ${config} has been loaded`)
      logger.info(`🌎  The RestQA editor is started and available on the url: http://localhost:${port}`)
    })
}
