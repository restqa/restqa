const  { generate, initialize, install, steps } = require('./cli')

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

function Steps(options) {
  return steps(options.keyword, {
    configFile: options.configFile || './.restqa.yml',
    tag: options.tag,
    print: false
  })
}

module.exports = {
  Initialize,
  Generate,
  Install,
  Steps
}
