const https = require('https')

const BASE_URL = 'restqa.io'

function info() {
  const defaultInfo = {
    team: {
      note: {
        message: 'We are happy to have you in the RestQA Family, we are happy to support you on your testing journey. ❤️',
        from: 'RestQA team',
        avatar: '/logo.png'
      }
    }
  }

  const options = {
    hostname: BASE_URL,
    port: 443,
    path: '/info',
    method: 'GET'
  }

  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      res.on('data', data => {
        if (/json/.test(res.headers['content-type']) === false) {
          data = defaultInfo
        } else {
          data = JSON.parse(data.toString('utf-8'))
        }
        resolve(data)
      })
    })
    req.on('error', error => {
      resolve(defaultInfo)
    })
    req.end()
  })
}

module.exports = {
  info
}
