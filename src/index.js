const {
  generate,
  install,
  steps,
  run,
  dashboard
} = require('./cli')
const os = require('os')
const fs = require('fs')
const path = require('path')

async function Initialize () {
  // @todo
}

/**
 * Generate a test scenario from a curl command
 *
 * @param {string} The curl command that need to be converted as a scenario
 *
 * @return Array<obj>
 *
 * @example
 *
 * const { Generate } = require('@restqa/restqa')
 *
 * const cmd = "curl -X GET https://jsonplaceholder.typicode.com/todos/1"
 *
 * const result = await Generate(cmd)
 * console.log(result)
 */
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

/**
 * Install a new integration into your configuration
 *
 * @param {Object} options
 * @param {string} option.name - The name of the integration you want to install (ex: 'slack')
 * @param {string} option.configFile - Location of the RestQA Configuration File (ex: './restqa.yml')
 * @param {string} option.env - The target enviironment (from your RestQA config file) (ex: 'local')
 * @param {options} option.config - Represent the configuration required to setup the addon
 *
 * @return Array<obj>
 *
 * @example
 *
 * const { Install } = require('@restqa/restqa')
 *
 * const options = {
 *   name: 'discord',
 *   configFile: './restqa.yml',
 *   env: 'prod',
 *   config: {
 *     url: 'http://webhook.discord.com/test'
 *   }
 * }
 *
 * const result = await Install(options)
 * console.log(result)
 */
function Install (options) {
  return install.generate(options)
}

/**
 * Retrieve the list of step definition available
 *
 * @param {Object} options
 * @param {string} options.keyword - The path of the RestQA configuration file (given | then | when)
 * @param {string} options.config - The path of the RestQA configuration file
 * @param {string} options.env - The target environment from the RestQA configuration file
 * @param {string} options.tags - The tag used to filter the steps
 *
 * @return Array<obj>
 *
 * @example
 *
 * const { Steps } = require('@restqa/restqa')
 *
 * const options = {
 *   keyword: 'given',
 *   configFile: './restqa.yml',
 *   env: 'prod',
 *   tags: 'headers'
 * }
 *
 * const result = Steps(options)
 * console.log(result)
 */
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
 *   configFile: './restqa.yml',
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

/**
 * Expose the RestQA Dashboard using a specific configuration
 *
 * @param {Object} options
 * @param {string} options.config - The path of the RestQA configuration file
 *
 * @return http.server
 *
 * @example
 *
 * const { Dashboard } = require('@restqa/restqa')
 *
 * const options = {
 *   configFile: './restqa.yml',
 * }
 *
 * const server = Dashboard(options)
 * server.listen(8000, () => {
 *   console.log('The dashboard is running on the port 8000')
 * })
 */

function Dashboard (options) {
  const opt = {
    config: options.configFile,
    serve: false
  }
  return dashboard(opt)
}

module.exports = {
  Initialize,
  Generate,
  Install,
  Steps,
  Dashboard,
  Run
}
