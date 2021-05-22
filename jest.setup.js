const path = require('path')
const os = require('os')
const fs = require('fs')
const rimraf = require('rimraf')

global.JestQA = function(filename, unmount = false, debug = false) {
  const DEFAULT_CONFIG = path.resolve(process.cwd(), '.restqa.yml') 
  const testName = path.basename(filename).replace('.test.js', '')
  const tests = []

  let current

  const init = function() {
    current = Object.seal({
      id: testName + '-' + Math.floor(Math.random() * 10000000) + '-' + Date.now(),
      files: [
        DEFAULT_CONFIG
      ],
      folders: [],
      debug: false
    })
    tests.push(current)
    global.console.info = jest.fn()
  }

  const _log = function(msg) {
    (debug ||  current.debug) && console.log(`/JESTSQA/{ ${testName} } ->`, msg)
    return true
  }

  const create = function(content, filename) {
    _log(`creating file ${filename}`)
    const folder = path.dirname(filename)
    fs.mkdirSync(folder, {recursive: true})
    fs.writeFileSync(filename, content)
    current.files.push(filename)
    _log(`File ${filename} created`)
    return filename
  }

  const createTmpFile = function(content, file) {
    if (!current) init()
    filename = path.resolve(os.tmpdir(), testName, current.id, file)
    return create(content, filename)
  }

  const createCwdConfig = function(content) {
    if (!current) init()
    return create(content, DEFAULT_CONFIG)
  }

  const getLoggerMock = function() {
    return global.console.info
  }

  const clean = function() {
    if (true === unmount) {
      _log(`unmount mock`)
      jest.resetModules()
      jest.resetAllMocks()
    }

    current.files
      .forEach(file => {
        _log(`deleting file ${file}`)
        fs.existsSync(file) && fs.unlinkSync(file)
      })
  }

  const hooks = Object.seal({
    beforeEach: null,
    afterEach: null
  })

  const beforeEach = function() {
    init()
    _log(`Creating test ${current.id}`)
    clean()

    hooks.beforeEach && _log('calling hook beforeEach') && hooks.beforeEach.call(this)
  }

  const afterEach = function() {
    if (!current) init()
    clean()
    hooks.afterEach && _log('calling hook afterEach') && hooks.afterEach.call(this)
    current = null
  }

  return {
    beforeEach,
    afterEach,
    getCurrent: () => current,
    createTmpFile,
    createCwdConfig,
    getLoggerMock,
    hooks,
  }

}
