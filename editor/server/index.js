const express = require('express')
const path = require('path')

module.exports = function (configFile) {
  return express()
    .set('restqa.configuration', configFile)
    .use(express.json())
    .use(express.static(path.resolve(__dirname, '..', 'client', 'dist')))
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
