const execa = require("execa");
const logger = require("../utils/logger");

module.exports = {
  /**
   * 
   * @param {string} command

   */
  execute: async function executeCommand(command) {
    if (typeof command === "string") {
      const child = await execa.command(command);
      process.stdout.write(child.stdout);
      logger.success(`Server is running ${command}`)
    }
    else {
      throw new Error(`Executor: command should be a string but received ${typeof command}`);
    }
  }
}