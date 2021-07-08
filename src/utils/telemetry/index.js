const path = require('path')
const childProcess = require('child_process')

class Telemetry {
  constructor (options) {
    this._consent = false
    this._options = options
  }

  set consent (val) {
    this._consent = val
  }

  get consent () {
    return this._consent
  }

  track (category, action, label) {
    if (!this.consent) return
    const cp = childProcess.fork(path.join(__dirname, 'child.js'), { silent: true })
    cp.send({
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
