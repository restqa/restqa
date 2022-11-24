const Channels = require('./channels')
const Storages = require('./storages')

function getChannel (opt) {
  const ChannelFn = Channels[opt.channel]
  if (!ChannelFn) throw new Error(`The channel "${opt.channel}" doesn't exist. Available : ${Object.keys(Channels).join(', ')}`)
  return new ChannelFn(opt.config)
}

function getStorage (opt) {
  return Storages(opt)
}

module.exports = function (options) {
  options = options || {}
  let result = {}
  if (options.channel) {
    result = getChannel(options)
  }
  result.storage = getStorage(options)
  return result
}
