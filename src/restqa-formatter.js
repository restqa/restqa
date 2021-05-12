const { getFormatter } = require('@restqa/cucumber-export')
const Config = require('./config')

const restqa = {
  env: process.env.RESTQA_ENV && String(process.env.RESTQA_ENV).toLowerCase(),
  configFile: process.env.RESTQA_CONFIG,
  tmpFileExport: process.env.RESTQA_TMP_FILE_EXPORT
}

const config = new Config(restqa)

const options = {
  title: 'LET\'S EXPORT TEST RESULT...',
  key: config.metadata.code,
  name: config.metadata.name,
  env: config.environment.name,
  repository: process.env.GITHUB_REPOSITORY || process.env.CI_PROJECT_PATH || process.env.BITBUCKET_REPO_SLUG || process.env.RESTQA_REPOSITORY,
  sha: process.env.GITHUB_SHA || process.env.CI_COMMIT_SHA || process.env.BITBUCKET_COMMIT || process.env.RESTQA_COMMIT_SHA,
  outputs: config.environment.outputs || []
}

if (restqa.tmpFileExport) {
  options.outputs.push({
    type: 'file',
    enabled: true,
    config: {
      path: restqa.tmpFileExport
    }
  })
}

module.exports = getFormatter(options)
