const kill = require("tree-kill");
const {ChildProcess} = require("child_process");
const spawn = require("cross-spawn");
const {Logger, Locale} = require("@restqa/core-logger");
const net = require("net");
const {format} = require("util");
const {on, exit} = require("./utils/process");

const DEFAULT_TIMEOUT = 4000;
class Microservice {
  constructor(options) {
    const {port, command, envs, silent, timeout, state} = options;

    this._port = port;
    this._command = command;
    this._envs = envs || {};
    this._silent = silent || false;
    this._timeout = timeout || DEFAULT_TIMEOUT;
    this._isRunning = false;
    this._state = state;

    ["SIGTERM", "SIGHUP", "SIGINT", "SIGBREAK"].forEach((signal) => {
      on(signal, async () => {
        await this.stop();
        exit();
      });
    });
  }

  get port() {
    return this._port;
  }

  get command() {
    return this._command;
  }

  get envs() {
    return this._envs || {};
  }

  get silent() {
    return this._silent;
  }

  get timeout() {
    return this._timeout;
  }

  get server() {
    return this._server;
  }

  get isRunning() {
    return this._isRunning;
  }

  set coveragePath(value) {
    this._coveragePath = value;
  }

  get coveragePath() {
    return this._coveragePath;
  }

  start() {
    const command = this.command;
    const envs = this.envs || {};
    envs.PORT = this.port;
    envs.NODE_V8_COVERAGE = this.coveragePath;
    envs.NODE_ENV = process.env.NODE_ENV || "test";
    return new Promise((resolve, reject) => {
      if (typeof command !== "string") {
                throw new Error(
          `Microservice: command should be a string but received ${typeof command}`
        );
      }

      const [exec, args] = this._formatCommand(command);
      let initialized = false;
      const server = spawn(exec, args, {
        env: {
          ...process.env,
          ...envs
        }
      });

      // reject if an error happened
      server.stderr.on("data", (chunk) => {
        this.log(chunk.toString());
        if (!initialized) {
          initialized = true;
          reject(new Error(`Error during running command ${command}`));
        }
      });

      // resolve when process is spawn successfully
      server.stdout.on("data", (chunk) => {
        this.log(chunk.toString());
        if (!initialized) {
          initialized = true;
          Logger.success(`Server is running (command: ${command})`);
          resolve(server);
        }
      });

      // handle when server doesn't output anythin
      setTimeout(() => {
        if (!initialized) {
          initialized = true;
          Logger.success(`Server is running (command: ${command})`);
          resolve(server);
        }
      }, this.timeout / 2);

      // handle when server (process) is closing
      server.on("close", () => {
        Logger.debug("Server closed!");
      });

      // handle error
      server.on("error", () => {
        // Note: we only do it this way to be win32 compliant.
        server.kill();
      });
      this._server = server;
    }).then(() => {
      if (!this.port) return this.server;
      return this.isReady();
    });
  }

  log(str) {
    if (this.silent) return;
    this._state?.outputStream?.addDebugLog(str);
  }

  async isReady() {
    Logger.info("service.run.waiting_server");
    const port = this.port;
    const timeout = this.timeout;
    const controller = new AbortController();
    return Promise.any([
      this.checkServer(controller, port, timeout),
      this.checkServer(controller, port, timeout, "0.0.0.0")
    ])
      .then((response) => {
        controller.abort();
        this._isRunning = true;
      })
      .then(() => {
        return this.server;
      })
      .catch((e) => {
        throw e.errors[0];
      });
  }

  checkServer(controller, port, timeout, host) {
    return new Promise((resolve, reject) => {
      const checker = () => {
        let isOut = false;
        let idTimeout;
        const opt = {
          port,
          host
        };
        const socket = net.createConnection(opt);
        socket.on("ready", (err) => {
          if (err) reject(err);
          resolve();
          socket.destroy();
          isOut = true;
        });
        socket.on("error", (err) => {
          socket.destroy();
          timeout -= 200;
          if (err.code !== "ECONNREFUSED") {
            isOut = true;
            return reject(err);
          }
          if (timeout > 0) {
            idTimeout = setTimeout(() => {
              checker();
            }, 200);
          } else {
            isOut = true;
            reject(
              new Error(
                format(
                  Locale().service.run.error_port_timeout,
                  port,
                  this.timeout
                )
              )
            );
          }
        });

        // Since we are using Promise.any we should kill the ongoing promise to release the event loop
        controller.signal.addEventListener("abort", () => {
          if (isOut) return;
          socket.destroy();
          clearTimeout(idTimeout);
          resolve();
        });
      };
      checker();
    });
  }

  stop() {
    return new Promise((resolve, reject) => {
      if (this.server instanceof ChildProcess) {
        kill(this.server.pid, "SIGTERM", () => {
          this._isRunning = false;
          this.server.kill();
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  _formatCommand(command) {
    const splittedTokens = command.split(" ");
    const exec = splittedTokens.shift();
    return [exec, splittedTokens];
  }
}

module.exports = Microservice;
