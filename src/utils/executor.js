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

        // reject if an error happened
        server.stderr.on("data", () => {
          reject(new Error(`Error during running command ${command}`))
        })

        // resolve when process is spawn successfully
        server.stdout.on("data", () => {
          if (!controller || (controller && !controller.signal.aborted)) {
            logger.success(`Server is running (command: ${command})`)
          }
          resolve(server);
        });

        server.on("close", () => {
          if (!controller || (controller && !controller.signal.aborted)) {
            logger.info("Server closed!")
          }
        })
      }
      else {
        throw new Error(`Executor: command should be a string but received ${typeof command}`);
      }
    });
  }
}