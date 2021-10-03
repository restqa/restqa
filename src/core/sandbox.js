const EventEmitter = require("events");

class Sandbox extends EventEmitter {
  constructor() {
    super();
    this.on("request", this.handler);
  }

  handler(transaction) {
    const data = {
      transaction,
      status: "PENDING",
      scenario: this.getScenario(transaction),
      createdAt: new Date()
    };
    this.emit("generated", data);
  }

  getScenario() {
    return "Scenario: ...";
  }
}

module.exports = Sandbox;
