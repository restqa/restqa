const glob = require('glob')
const path = require('path')
const fs = require('fs')
const YAML = require('yaml')

function features (root) {
  const pattern = path.join('.', '{*.feature,!(node_modules)', '**', '*.feature}')
  return glob.sync(pattern, { cwd: root })
}

function config (filename, options = {}) {
  const content = fs.readFileSync(filename).toString('utf-8')
  const result = YAML.parse(content)
  if (typeof options.readOnly === 'boolean') {
    result.restqa = result.restqa || {}
    result.restqa.dashboard = result.restqa.dashboard || {}
    result.restqa.dashboard.readOnly = options.readOnly
  }
  return result
}

module.exports = {
  features,
  config
}
