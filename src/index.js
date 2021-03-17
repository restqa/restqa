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

/**
 * Execute RestQA test suite using specific configuration
 *
 * @param {Object} options
 * @param {string} options.config - The path of the RestQA configuration file
 * @param {string} options.env - The target environment from the RestQA configuration file
 * @param {stream.Writable} options.stream - The stream to export the logs
 * @param {array} options.tags - The list of tags
 * @param {string} options.path - The path of the feature files
 *
 * @return Promise<obj>
 *
 * @example
 *
 * const { Run } = require('@restqa/restqa')
 *
 * const options = {
 *   config: './restqa.yml',
 *   env: 'prod',
 *   stream: process.stdout,
 *   tags: [
 *     '@production',
 *     '@success'
 *   ],
 *   path: './tests'
 * }
 *
 * const result = await Run(options)
 * console.log(result)
 */

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
    tags: options.tags || [],
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
