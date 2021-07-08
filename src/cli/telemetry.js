const logger = require('../utils/logger')
const Telemetry = require('../utils/telemetry')

module.exports = function (status) {
  const telemetry = new Telemetry()

  status = status.toLowerCase()
  const choices = ['on', 'off']

  if (!choices.includes(status)) {
    throw new Error('The status is incorrect. Available: on | off')
  }

  telemetry.toggle(status === 'on')
  logger.success('service.telemetry.toggle', status === 'on' ? 'enabled' : 'disabled')
}
