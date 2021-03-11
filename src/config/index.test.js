const fs = require('fs')
let filename

afterEach(() => {
  jest.resetModules()
  if (filename && fs.existsSync(filename)) {
    fs.unlinkSync(filename)
  }
})

beforeEach(() => {
  if (filename && fs.existsSync(filename)) {
    fs.unlinkSync(filename)
    filename = undefined
  }
})

describe('#Config locate', () => {
  const Config = require('./index')
  test('Throw an error if the restqa config file doesn\t exist in the current file (no options passed)', () => {
    expect(() => {
      Config.locate()
    }).toThrow(`The configuration file "${process.cwd()}/.restqa.yml" doesn't exist."`)
  })

  test('Return the file path if the config file is found', () => {
    filename = `${process.cwd()}/.restqa.yml`
    fs.writeFileSync(filename, 'the file content')

    const result = Config.locate()
    expect(result).toEqual(filename)
  })

  test('Throw an error if the config file passed doesn\'t exist in the current folder', () => {
    expect(() => {
      Config.locate({ configFile: '.example.restqa.yml' })
    }).toThrow(`The configuration file "${process.cwd()}/.example.restqa.yml" doesn't exist."`)

    expect(() => {
      Config.locate({ configFile: '/tmp/.example.restqa.yml' })
    }).toThrow('The configuration file "/tmp/.example.restqa.yml" doesn\'t exist."')
  })

  test('Return the file path if the config file is found in a specific folder', () => {
    filename = '/tmp/.restqa.yml'
    fs.writeFileSync(filename, 'the file content')

    const result = Config.locate({ configFile: filename })
    expect(result).toEqual(filename)
  })

  test('Throw an error if the passed path parameter is not a folder', () => {
    expect(() => {
      Config.locate({ path: 'README.md' })
    }).toThrow(`The path "${process.cwd()}/README.md" is not a folder`)
  })

  test('Return the config file if the passed path contains a config file', () => {
    filename = '/tmp/.restqa.yml'
    fs.writeFileSync(filename, 'the file content')
    const result = Config.locate({ path: '/tmp' })
    expect(result).toEqual(filename)
  })

  test('Throw an error if the passed folder doesn\'t contain the passed file', () => {
    expect(() => {
      Config.locate({ path: '/tmp', configFile: '.example.yml' })
    }).toThrow('The configuration file "/tmp/.example.yml" doesn\'t exist."')
  })

  test('Return the config file if the passed path contains a config file and a specific config file name', () => {
    filename = '/tmp/.example.yml'
    fs.writeFileSync(filename, 'the file content')
    const result = Config.locate({ configFile: '.example.yml', path: '/tmp' })
    expect(result).toEqual(filename)
  })
})
