const  generate = require('./cli/generate')
const  initialize = require('./cli/initialize')
const  install = require('./cli/install')

async function Initialize() {
}

async function Generate (cmd) {
  let args = cmd
    .match(/"[^"]+"|'[^']+'|\S+/g)
    .map(str => str.replace(/^"/, '').replace(/"$/, ''))

  const options = {
    args,
    print: false
  }

  return  generate(options)
}


function Install(options) {
  return install.generate(options)
}

module.exports = {
  Initialize,
  Generate,
  Install
}
