const chalk = require('chalk')
const Welcome = function (options = {}) {
  if (options.enabled === false) return

  if (!options.messages || !options.messages.length) {
    options.messages = this.MESSAGES
  }

  const index = Math.floor(Math.random() * (options.messages.length - 0) + 0)
  this.text = options.messages[index]
}

// All the link needs to be colored into yellow
// Because we have test that checking all the broken links (welcome.test.js > "Detect broken link from the messages")
Welcome.prototype.MESSAGES = [
  `❤️ Join the ${chalk.red('discord')} community: ${chalk.yellow('https://restqa.io/chat')}`,
  `Give us a star ⭐️ on Github: ${chalk.yellow('https://github.com/restqa/restqa')}`,
  `You can use ${chalk.green('fake data')} using the RestQA Faker plugin`,
  `You can generate performance load test scenario compatible with Artillery.io: ${chalk.yellow('https://docs.restqa.io/performance/artillery')}`,
  `${chalk.red('RestQA')} is totally ${chalk.green('free!')}`,
  `Check our ${chalk.red('video')} 🎥 online: ${chalk.yellow('https://restqa.io/youtube')}`,
  `Share your feedback 👍 to us: ${chalk.yellow('https://restqa.io/feedback')}`,
  `${chalk.green('Follow us')} on ${chalk.red('Twitter')} to stay up to date: ${chalk.yellow('https://twitter.com/restqa')}`,
  `You can ${chalk.green('contribute')} to ${chalk.red('RestQA')} just by giving us a start ⭐️ on Github: ${chalk.yellow('https://github.com/restqa/restqa')}`,
  `Check our ${chalk.red('blog post')}: ${chalk.yellow('https://medium.com/restqa')} 🤓`
]

Welcome.prototype.toString = function () {
  return this.text
}

module.exports = Welcome
