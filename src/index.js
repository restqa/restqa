const {
  generate,
  install,
  steps,
  run
} = require('./cli')
const os = require('os')
const fs = require('fs')
const path = require('path')

async function Initialize () {
}

async function Generate (cmd) {
  const args = cmd
    .match(/"[^"]+"|'[^']+'|\S+/g)
    .map(str => str.replace(/^"/, '').replace(/"$/, ''))

  const options = {
    args,
    print: false
  }

  return generate(options)
}

function Install (options) {
  return install.generate(options)
}

function Steps (options) {
  return steps(options.keyword, {
    config: options.configFile || './.restqa.yml',
    tag: options.tag,
    print: false
  })
}

async function Run (options) {
  const uuid = Math.floor(Math.random() * 10000000)
  const filename = path.resolve(os.tmpdir(), `restqa-result-${uuid}.json`)
  process.env.RESTQA_TMP_FILE_EXPORT = filename
  let args

  if (options.path) {
    args = [options.path]
  }

  await run({
    config: options.configFile,
    env: options.env,
    stream: options.stream,
    args
  })

  const result = fs.readFileSync(filename).toString('utf-8')
  return JSON.parse(result)
}

module.exports = {
  Initialize,
  Generate,
  Install,
  Steps,
  Run
}
