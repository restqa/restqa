const express = require('express')
const path = require('path')

module.exports = function (configFile, options = {}) {
  return express()
    .set('restqa.configuration', configFile)
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
    .use('/openapi', express.static(path.resolve(__dirname, '.', 'openapi')))
    .use(require('./routes'))
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
