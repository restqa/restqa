const chalk = require('chalk')
const debug = require('debug')('restqa')

module.exports = {
  error: function () {
    console.log(chalk.bold.red.apply(this, arguments))
    debug(arguments[0])
  },
  info: function () {
    console.log(chalk.bold.blue.apply(this, arguments))
  },
  log: function () {
    console.log.apply(this, arguments)
  },
  success: function () {
    console.log(chalk.bold.green.apply(this, arguments))
  },
  warning: function () {
    console.log(chalk.bold.yellow.apply(this, arguments))
  }
}
