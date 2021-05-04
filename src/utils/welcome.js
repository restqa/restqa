const chalk = require('chalk')
const logger = require('./logger')

const MESSAGES = [
  `❤️ Join the ${chalk.red('discord')} community: ${chalk.yellow('https://restqa.io/chat')}`
]

const Welcome = function (options = {}) {
  if (options.enabled === false) return

  if (!options.messages || !options.messages.length) {
    options.messages = MESSAGES
  }

  const index = Math.floor(Math.random() * (options.messages.length - 0) + 0)
  const msg = options.messages[index]
  // logger.log(Array(msg.length).fill('-').join(''))
  logger.log(msg)
  // logger.log(Array(msg.length).fill('-').join(''))
}

module.exports = Welcome
