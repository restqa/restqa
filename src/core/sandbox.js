const EventEmitter = require("events");
const {Generator} = require("@restqa/restqapi");

class Sandbox extends EventEmitter {
  constructor() {
    super();
    this.on("request", this.handler);
  }

  async handler(transaction) {
    let scenario = "";
    try {
      scenario = await this.getScenario(transaction);
    } catch (e) {
      scenario = "An error occured while generating the test: " + e.message;
    }

    const data = {
      transaction,
      status: "PENDING",
      scenario,
      createdAt: new Date()
    };
    this.emit("generated", data);
  }

  getScenario(transaction) {
    return Generator(transaction);
  }
}

module.exports = Sandbox;
