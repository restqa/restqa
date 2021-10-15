const spawn = require("cross-spawn");
const logger = require("../utils/logger");

module.exports = {
  /**
   *
   * @param {string} command
   */
  execute: async function executeCommand(command) {
    return new Promise((resolve, reject) => {
      if (typeof command === "string") {
        let initialized = false;
        const server = spawn(command, {
          shell: true
        });

        // reject if an error happened
        server.stderr.on("data", () => {
          if (!initialized) {
            initialized = true;
            reject(new Error(`Error during running command ${command}`));
          }
        });

        // resolve when process is spawn successfully
        server.stdout.on("data", () => {
          if (!initialized) {
            initialized = true;
            logger.success(`Server is running (command: ${command})`);

            resolve(server);
          }
        });

        // handle when server (process) is closing
        server.on("close", () => {
          logger.debug("Server closed!");
        });

        // handle error
        server.on("error", () => {
          // Note: we only do it this way to be win32 compliant.
          server.kill();
        });
      } else {
        throw new Error(
          `Executor: command should be a string but received ${typeof command}`
        );
      }
    });
  }
};
