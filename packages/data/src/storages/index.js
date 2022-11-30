const path = require('path')
const fs = require('fs')
const os = require('os')

module.exports = function (options) {
  options = options || {}

  if (!options.storage) {
    options.storage = os.tmpdir()
    if (options.logger) {
      options.logger.log(`[RESTQDATA] No storage found (default: ${options.storage})`)
    }
  }

  const get = (filename) => {
    filename = path.resolve(options.storage, filename)
    if (!fs.existsSync(filename)) {
      throw new Error(`[RESTQDATA] Impossible to load the file from the storage ${filename}`)
    }
    return filename
  }

  const set = (filename, data) => {
    filename = path.resolve(options.storage, filename)
    const buff = Buffer.from(data, 'base64')
    fs.writeFileSync(filename, buff)
    return filename
  }

  return {
    get,
    set
  }
}
