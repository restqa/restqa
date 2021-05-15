const express = require('express')
const path = require('path')

module.exports = function (configFile, options = {}) {
  options = formatOptions(options)
  return express()
    .set('restqa.configuration', configFile)
    .set('restqa.options', options)
    .use((req, res, next) => {
      const { origin } = req.headers
      const whiteList = [
        'http://localhost:3000'
      ].concat((options.server && options.server.whiteList) || [])

      if (whiteList.includes(origin)) {
        res.set('Access-Control-Allow-Origin', origin)
        res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
      }
      next()
    })
    .use(express.json())
    .use(express.static(path.resolve(__dirname, '..', '..', 'dashboard', 'dist')))
    .use(require('./routes'))
    .use('/api', express.static(path.resolve(__dirname, '.', 'openapi')))
    .use(options.server.report.urlPrefixPath, express.static(path.resolve(options.server.report.outputFolder)))
    .use((err, req, res, next) => {
      if (err instanceof TypeError || err instanceof ReferenceError) {
        res.status(406)
      } else {
        res.status(500)
      }
      res.json({
        message: err.message
      })
    })
}

function formatOptions (options) {
  options.server = options.server || {}
  options.server.whiteList = options.server.whiteList || []
  options.server.report = options.server.report || {}
  options.server.report.urlPrefixPath = options.server.report.urlPrefixPath || '/reports'
  // @todo: add a validation to ensure the urlPrefixPathreport starts with a '/'
  options.server.report.outputFolder = options.server.report.outputFolder || path.resolve(process.cwd(), 'reports')
  return options
}
