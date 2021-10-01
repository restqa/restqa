const EventEmitter = require("events");

class Sandbox extends EventEmitter {
  constructor() {
    super();
    this.on("request", this.handler);
  }

  handler(request) {
    const data = {
      request,
      status: 'PENDING',
      scenario: this.getScenario(request),
      createdAt: new Date()

    }
    this.emit('generated', data)
  }

  getScenario (request) {
    return 'Scenario: ...'
  }
}

module.exports = Sandbox;
