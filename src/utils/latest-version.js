const packageJson = require('package-json')
const { info } = require('./logger')

module.exports = async function (currentVersion) {
  try {
    const { version } = await packageJson('@restqa/restqa')
    const result = (version === currentVersion)
    if (result === false) {
      const message = `
 --
|
| ⚡Your RestQA version (${currentVersion}) is not up to date.
| 🦏 The latest version is ${version}
|
| To update your RestQA version run the following command:           
| npm i -g @restqa/restqa@latest
|
 --
    `
      info(message)
    }
    return Promise.resolve(result)
  } catch (e) {
    return Promise.resolve(false)
  }
}
