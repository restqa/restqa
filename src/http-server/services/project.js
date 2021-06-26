const glob = require('glob')
const path = require('path')

function features (root) {
  const pattern = path.join('.', '{*.feature,!(node_modules)', '**', '*.feature}')
  return glob.sync(pattern, { cwd: root })
}

module.exports = {
  features
}
