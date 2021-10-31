const spawn = require("cross-spawn");
const logger = require("../utils/logger");
const net = require("net");
const Locale = require("../locales")("service.run");

module.exports = {
  /**
   *
   * @param {string} command
   * @param {object} envs
   */
  execute: async function executeCommand(command, envs) {
    return new Promise((resolve, reject) => {
      if (typeof command === "string") {
        let initialized = false;
        const server = spawn(command, {
          shell: true,
          envs: {
            ...process.env,
            ...envs
          }
        });

        // reject if an error happened
        server.stderr.on("data", (er) => {
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
  },
  checkServer: async function (port, timeout = 4000) {
    return new Promise((resolve, reject) => {
      const checker = () => {
        const socket = net.createConnection({port});
        socket.on("ready", function (err) {
          if (err) reject(err);
          resolve();
          socket.destroy();
        });
        socket.on("error", function (err) {
          socket.destroy();
          timeout -= 200;
          if (err.code !== "ECONNREFUSED") {
            return reject(err);
          }
          if (timeout > 0) {
            setTimeout(checker, 200);
          } else {
            reject(new Error(Locale.get("error_port_timeout")));
          }
        });
      };
      checker();
    });
  }
};
