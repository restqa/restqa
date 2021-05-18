const chalk = require('chalk')
const debug = require('debug')('restqa')
const Locale = require('../locales')()

module.exports = {
  error: function () {
    if (!(arguments[0] instanceof Error)) {
      arguments[0] = Locale.get(arguments[0]) || arguments[0]
    }
    arguments[0] = chalk.bold.red.call(this, arguments[0])
    this.log.apply(this, arguments)
    debug(arguments[0])
  },
  info: function () {
    arguments[0] = Locale.get(arguments[0]) || arguments[0]
    arguments[0] = chalk.bold.blue.call(this, arguments[0])
    this.log.apply(this, arguments)
  },
  log: function () {
    console.info.apply(this, arguments)
  },
  success: function () {
    arguments[0] = Locale.get(arguments[0]) || arguments[0]
    arguments[0] = chalk.bold.green.call(this, arguments[0])
    this.log.apply(this, arguments)
  },
  warning: function () {
    arguments[0] = Locale.get(arguments[0]) || arguments[0]
    arguments[0] = chalk.bold.yellow.call(this, arguments[0])
    this.log.apply(this, arguments)
  }
}
