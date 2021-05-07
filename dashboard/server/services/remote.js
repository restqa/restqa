const https = require('https')

const BASE_URL = 'restqa.io'

function info () {
  const defaultInfo = {
    team: {
      blog: {
        url: 'https://medium.com/restqa',
        last: {
          title: 'RestQA is here! Do your end-to-end API test integration, the right way!',
          date: '2021-02-02 02:24:19',
          image: 'https://cdn-images-1.medium.com/max/1024/1*iyyY6QkAAE2bOzNRevfCuw.png',
          author: {
            username: '@Olivierodo',
            avatar: 'https://cdn-images-1.medium.com/fit/c/150/150/1*acYALd6w84KRScRNMpFLUg.jpeg'
          },
          url: 'https://medium.com/restqa/restqa-is-here-do-your-end-to-end-api-test-integration-the-right-way-84b7313e1291'
        }
      },
      video: {
        url: 'https://www.youtube.com/channel/UCdT6QenNLmnxNT-aT8nYq_Q',
        last: {
          title: 'RestQA',
          date: '2021-04-17 03:00:30',
          image: 'https://i2.ytimg.com/vi/EberYFGPZPo/hqdefault.jpg',
          url: 'https://www.youtube.com/watch?v=EberYFGPZPo'
        }
      },
      note: {
        message: 'We are happy to have you in the RestQA Family, we are happy to support you on your testing journey. ❤️',
        from: 'RestQA team',
        avatar: '/logo.png'
      }
    },
    sponsors: [
      {
        url: 'https://atalent-consulting.com',
        name: 'RestQA is here! Do your end-to-end API test integration, the right way!',
        logo: 'https://atalent-consulting.com/logo.png'
      }
    ]
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
