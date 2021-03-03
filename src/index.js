const  {
  generate,
  initialize,
  install,
  steps,
  run
} = require('./cli')
const os = require('os')
const fs = require('fs')
const path = require('path')

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

async function Run(options) {
  try {
    const uuid = Math.floor(Math.random()* 10000000)
    let filename = path.resolve(os.tmpdir(), `restqa-result-${uuid}.json`)
    process.env.RESTQA_TMP_FILE_EXPORT =  filename
    let args = undefined

    if (options.path) {
      args = [options.path]
    }

    const result = await run({
      config: options.configFile,
      env: options.env,
      stream: options.stream,
      args
    })

    return JSON.parse(fs.readFileSync(filename).toString('utf-8'))
  } catch(err) {
    throw err
  }
}

module.exports = {
  Initialize,
  Generate,
  Install,
  Steps,
  Run,
}
