const fs = require('fs')
const path = require('path')
const http = require('http')
const logger = require('../utils/logger')
const DashboardServer = require('../http-server')
const Config = require('../config')

module.exports = function (program) {
  let {
    port = 8081,
    serve = true,
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

  const raw = Config.raw({ configFile: config })
  const options = (raw.restqa || {}).dashboard

  const httpSever = http.createServer(DashboardServer(config, options))

  if (serve) {
    return httpSever
      .listen(port, err => {
        if (err) throw err
        logger.info('service.dashboard.config_loaded', config)
        logger.info('service.dashboard.server_start',`http://localhost:${port}`)
      })
  }
  return httpSever
}
