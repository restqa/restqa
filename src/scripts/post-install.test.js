const chalk = require('chalk')
const rimraf = require('rimraf')
const fs = require('fs')
const path = require('path')

describe('post-install', () => {
  let folder
  beforeAll(function () {
    console.log('-------------->', process.platform)
    this.originalPlatform = process.platform
  })

  afterEach(() => {
    jest.resetModules()
    jest.resetAllMocks()
    Object.defineProperty(process, 'platform', {
      value: this.originalPlatform
    })

    if (folder) {
      rimraf.sync(folder)
    }
  })

  test('Share a message to the user to get started with RestQA (global installation)', () => {
    global.console = {
      log: jest.fn()
    }
    Object.defineProperty(process, 'platform', {
      value: 'linux'
    })
    require('./post-install')
    const expectedOutput = [
      '',
      '',
      '',
      '',
      `     Thanks for trusting  ${chalk.green.bold('RestQA')} 🦏 to support you on increasing your ${chalk.bold('Software Quality')}`,
      `           If you like ${chalk.green.bold('RestQA')}, please give us a star ⭐️ on Github`,
      '                                      ---',
      '                 Get started easily by running the command 🚀:',
      `                                ${chalk.yellow.bold('restqa init')}`,
      '                                      ---',
      `                               ${chalk.dim('https://restqa.io')}`,
      '',
      '',
      ''
    ]
    expect(global.console.log).toHaveBeenCalledTimes(expectedOutput.length)
    expectedOutput.forEach((txt, i) => {
      expect(global.console.log.mock.calls[i][0]).toEqual(txt)
    })
  })

  test('Share a message to the user to get started with RestQA on a windows system(global installation)', () => {
    global.console = {
      log: jest.fn()
    }
    Object.defineProperty(process, 'platform', {
      value: 'win32'
    })
    require('./post-install')
    const expectedOutput = [
      '',
      '',
      '',
      '',
      `     Thanks for trusting  ${chalk.green.bold('RestQA')} to support you on increasing your ${chalk.bold('Software Quality')}`,
      `            If you like ${chalk.green.bold('RestQA')}, please give us a star on Github`,
      '                                      ---',
      '                   Get started easily by running the command:',
      `                                ${chalk.yellow.bold('restqa init')}`,
      '                                      ---',
      `                               ${chalk.dim('https://restqa.io')}`,
      '',
      '',
      ''
    ]
    expect(global.console.log).toHaveBeenCalledTimes(expectedOutput.length)
    expectedOutput.forEach((txt, i) => {
      expect(global.console.log.mock.calls[i][0]).toEqual(txt)
    })
  })

  test('Share a message to the user to get started with RestQA (local installation)', () => {
    global.console = {
      log: jest.fn()
    }
    Object.defineProperty(process, 'platform', {
      value: 'linux'
    })

    folder = fs.mkdirSync(path.resolve(process.env.PWD, 'node_modules', '@restqa', 'restqa'), { recursive: true })

    require('./post-install')
    const expectedOutput = [
      '',
      '',
      '',
      '',
      `     Thanks for trusting  ${chalk.green.bold('RestQA')} 🦏 to support you on increasing your ${chalk.bold('Software Quality')}`,
      `           If you like ${chalk.green.bold('RestQA')}, please give us a star ⭐️ on Github`,
      '                                      ---',
      `                               ${chalk.dim('https://restqa.io')}`,
      '',
      '',
      ''
    ]
    expect(global.console.log).toHaveBeenCalledTimes(expectedOutput.length)
    expectedOutput.forEach((txt, i) => {
      expect(global.console.log.mock.calls[i][0]).toEqual(txt)
    })
  })
})
