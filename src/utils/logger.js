const chalk = require('chalk')

module.exports = {
  error: function() {
    console.log(chalk.bold.red.apply(this, arguments))
    
  },
  info: function() {
    console.log(chalk.bold.blue.apply(this, arguments))
  },
  log: function () {
    console.log.apply(this, arguments)
  },
  success: function () {
    console.log(chalk.bold.green.apply(this, arguments))
  }
}

