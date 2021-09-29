const EventEmitter = require('events');

class Sandbox extends EventEmitter {

  constructor () {
    super()
    this.on('request', this.handler)
  }

  handler(msg) {
    // console.log('---->', msg)
  }

}

module.exports = Sandbox
