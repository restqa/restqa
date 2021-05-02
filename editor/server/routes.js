const Router = require('express').Router()
const Controllers = require('./controllers')

module.exports = Router
  .get('/version', Controllers.version)
  .get('/api/steps', Controllers.steps)
  .post('/api/generate', Controllers.generate)
  .post('/api/install', Controllers.install)
  .post('/api/run', Controllers.run)
