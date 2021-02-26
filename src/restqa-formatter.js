const { getFormatter } = require('@restqa/cucumber-export')
const Config = require('./config')

const restqa = {
  env: process.env.RESTQA_ENV && String(process.env.RESTQA_ENV).toLowerCase(),
  configFile: process.env.RESTQA_CONFIG
}

const config = new Config(restqa)

const options = {
  key: config.metadata.code,
  name: config.metadata.name,
  env: config.environment.name,
  repository: process.env.GITHUB_REPOSITORY || process.env.CI_PROJECT_PATH || process.env.BITBUCKET_REPO_SLUG || process.env.RESTQA_REPOSITORY,
  sha: process.env.GITHUB_SHA || process.env.CI_COMMIT_SHA || process.env.BITBUCKET_COMMIT || process.env.RESTQA_COMMIT_SHA,
  outputs: config.environment.outputs || []
}

if (config.analytics  && config.analytics.key) { // If the analytics exist we add an export to the restqa.io webhook
  if (!config.analytics.ignore || !config.analytics.ignore.includes(options.env)) {
    options.outputs.push({
      type: 'http',
      enabled: true,
      config: {
        url: process.env.RESTQA_ANALYTICS_URL || 'https://get.restqa.io/webhook',
        method: 'POST',
        headers: {
          'x-api-key': config.analytics.key
        }
      }
    })
  }
}


module.exports = getFormatter(options)
