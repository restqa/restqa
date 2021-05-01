const express = require('express')

module.exports = function (config) {
  return express()
    .get('/test', (req, res) => res.json({ message: 'pass!' }))
}

