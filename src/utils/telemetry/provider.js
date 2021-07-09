const querystring = require('querystring')
const debug = require('debug')('restqa')
const https = require('https')
const fs = require('fs')

module.exports = function (payload) {
  const { preferenceFile } = payload
  const content = JSON.parse(fs.readFileSync(preferenceFile).toString('utf-8')) || {}
  let consent = content.telemetry || false
  if (process.env.RESTQA_TELEMETRY) {
    consent = process.env.RESTQA_TELEMETRY === 'on'
  }
  if (consent === false) return

  const now = Date.now()
  const data = querystring.stringify({
    v: 1,
    t: 'event',
    aip: 1,
    tid: payload.trackingCode,
    cid: Math.floor(Math.random() * 10000),
    cd1: '',
    cd2: process.version,
    cd3: payload.version,
    z: now,
    ec: payload.category,
    ea: payload.action,
    el: payload.label
  })

  const options = {
    host: 'www.google-analytics.com',
    port: '443',
    path: '/collect',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(data)
    }
  }

  const request = https.request(options, function (res) {
    res.setEncoding('utf8')
    res.on('error', (err) => debug(err.message))
  })
  request.write(data)
  request.end()
}
