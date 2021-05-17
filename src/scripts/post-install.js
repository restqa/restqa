const chalk = require('chalk')
const isWin32 = process.platform === 'win32'

const print = (color = null) => (str = '') => {
  const width = 80
  const strLength = str.replace(/\u001B\[[0-9]{2}m/g, '').trim().length
  const leftPadding = ' '.repeat(Math.max((width - strLength) / 2, 5))
  if (color) {
    str = chalk[color](str)
  }
  console.log(str && leftPadding + str)
}

const emoji = emoji => process.stdout.isTTY && !isWin32 ? emoji : ''
const emptyLine = (N = 1) => Array(N).fill().forEach(_ => print()())
const separator = () => print()('---')

try {
  emptyLine(4)
  print()(`Thanks for trusting  ${chalk.green.bold('RestQA')} ${emoji('🦏 ')}to support you on increasing your ${chalk.bold('Software Quality')}`)
  print()(`If you like ${chalk.green.bold('RestQA')}, please give us a star ${emoji('⭐️ ')}on Github`)
  separator()
  print()(`Get started easily by running the command${emoji(' 🚀')}:`)
  print('yellow')(chalk.bold('restqa init'))
  separator()
  print('dim')('https://restqa.io')
  emptyLine(3)
} catch(err) {
  console('Thank for installing RestQA')
}
