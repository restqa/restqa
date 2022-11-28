const stream = require('stream')
const { getFormatter } = require('../index')

const instance = new stream.Writable({
  write: (data, encoding, next) => {
    console.log(JSON.parse(data.toString('utf-8')))
    next()
  }
})

const envConfig = {
  //uuid: 'xxx-yyy-zzz',
  name: 'Payment API',
  key: 'PAY-API',
  env: 'uat',
  //title: 'Hey Mate!',
  outputs: [
    {
      type: 'stream',
      enabled: false,
      config: {
        instance
      }
    },
    {
      type: 'webhook',
      enabled: false,
      config: {
        url: 'https://html-report.restqa.io',
        method: 'POST'
      }
    },
    {
      type: 'mattermost',
      enabled: false,
      config: {
        url: 'http://host.docker.internal:8065/hooks/wuyrdbew6bfabmjbm5ynxa6x3e',
        onlyFailed: true, // Trigger the hook only for test failure  (default: false),
        showErrors: true, // Show the error message within Mattermost,
        reportUrl: 'https://www.test.report/{uuid}', // The url to access to your detail test report if you have one
        username: 'RestQA', // Username to post as (only works if bot is allowed to change its name)
        iconUrl: 'https://restqa.io/assets/img/logos/restqa-logo-colors.png', // Link to bot profile picture (only works if bot is allowed to change image)
        //iconEmoji: 'laughing',  // An emoji tag without the ':'s for bot profile picture (only works if bot is allowed to change image)
        displayedErrorsLimit: 1 // Limit the number of errors displayed in one message
      }
    },
    {
      type: 'html-remote',
      enabled: false
    },
    {
      type: 'html',
      enabled: true,
      config: {
        browserOpening: true
      }
    },
    {
      type: 'html-remote',
      enabled: false,
      config: {
        url: 'https://httpdump.io/kqzjp',
        auth: {
          username: 'olive',
          password: 'test'
        }
      }
    },
    {
      type: 'slack',
      enabled: false,
      config: {
        url: 'https://hooks.slack.com/services/xxx/xxx',
        onlyFailed: true,
        showErrors: true,
        reportUrl: 'http://test.com/{uuid}'
      }
    },
    {
      type: 'line',
      enabled: false,
      config: {
        token: 'xxx',
        onlyFailed: true,
        //reportUrl: 'http://test.com/{uuid}'
      }
    },
    {
      type: 'discord',
      enabled: false,
      config: {
        url: 'https://discord.com/api/webhooks/xxx/xxx', // The discord webhook url
        onlyFailed: false, // Trigger the hook only for test failure  (default: false)
        showErrors: false,  // Show the error message within slack
        reportUrl: 'https://www.test.report/{uuid}', // The url to access to your detail test report if you have one,
        tts: false, // enable TTS for the message, false by default
      }
    },
    {
      type: 'elastic-search',
      enabled: false,
      config: {
        url: 'http://host.docker.internal:9200',
        //url: 'http://35.185.177.79:9200',
      }
    },
    {
      type: 'microsoft-teams',
      enabled: false,
      config: {
        url: 'https://outlook.office.com/webhook/xxx', // The teams webhook url
        onlyFailed: true, // Trigger the hook only for test failure  (default: false)
        showErrors: true,  // Show the error message within teams
        reportUrl: 'https://www.test.report/{uuid}' // The url to access to your detail test report if you have one
      }
    },
    {
      type: 'file',
      enabled: true,
      config: {
        path: 'my-report.json' // File to save
      }
    },
    {
      type: 'custom-report-key',
      enabled: true,
      config:{
        key: 'value'
      }
    }
  ],
  customExporters: {
    'custom-report-key': function(config, result) {
      const { key } = config
      //console.log(result.success)
      return Promise.resolve(`[CUSTOM REPORT][SUCCESS] - Your custom report is great!`)
    }
  }
}

module.exports = getFormatter(envConfig)
