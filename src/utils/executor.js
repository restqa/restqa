const spawn = require("cross-spawn");
const logger = require("../utils/logger");

module.exports = {
  /**
   * 
   * @param {string} command
   * @param {AbortController} controller

   */
  execute:  async function executeCommand(command, controller) {
    return new Promise((resolve, reject) => {
      if (typeof command === "string") {
        const server = spawn(command, {
          shell: true,
          signal: controller ? controller.signal : undefined
        });
        
        server.stdout.pipe(process.stdout)
        server.stdout.on("data", () => {
          logger.success(`Server is running ${command}`)
          resolve();
        })

        server.stderr.on("data", (data) => {
          reject(new Error(`Error during running command ${command}`))
        });

        server.on("close", () => {
          logger.info("Server closed!")
        })
      }
      else {
        throw new Error(`Executor: command should be a string but received ${typeof command}`);
      }
    });
  }
}