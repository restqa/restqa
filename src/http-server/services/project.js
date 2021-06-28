const glob = require('glob')
const path = require('path')
const fs = require('fs')
const YAML = require('yaml')

function features (root) {
  const pattern = path.join('.', '{*.feature,!(node_modules)', '**', '*.feature}')
  return glob.sync(pattern, { cwd: root })
}

function config (filename) {
  const content = fs.readFileSync(filename).toString('utf-8')
  return YAML.parse(content)
}

module.exports = {
  features,
  config
}
