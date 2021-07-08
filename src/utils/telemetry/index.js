const path = require('path')
const os = require('os')
const fs = require('fs')
const childProcess = require('child_process')

class Telemetry {
  constructor (options) {
    this._preferenceFile = path.resolve(os.homedir(), '.config', 'restqa.pref')
    this._options = options
  }

  toggle (val) {
    const content = JSON.stringify({ telemetry: val })
    const dirpath = path.dirname(this._preferenceFile)
    fs.mkdirSync(dirpath, { recursive: true, mode: parseInt('0700', 8) })
    fs.writeFileSync(this._preferenceFile, content, { mode: parseInt('0600', 8) })
  }

  track (category, action, label) {
    const cp = childProcess.fork(path.join(__dirname, 'child.js'), { silent: true })
    cp.send({
      preferenceFile: this._preferenceFile,
      category,
      action,
      label,
      ...this._options
    })
    cp.unref()
    cp.disconnect()
  }
}

module.exports = Telemetry
