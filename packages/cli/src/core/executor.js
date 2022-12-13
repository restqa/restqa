const kill = require("tree-kill");
const {ChildProcess} = require("child_process");
const spawn = require("cross-spawn");
const logger = require("../utils/logger");
const net = require("net");
const Locale = require("../locales")("service.run");
const {format} = require("util");

const DEFAULT_TIMEOUT = 4000;
class Executor {
  constructor(options) {
    const {port, command, envs, silent, timeout} = options;

    this._port = port;
    this._command = command;
    this._envs = envs || {};
    this._silent = silent || false;
    this._timeout = timeout || DEFAULT_TIMEOUT;
    this._isRunning = false;
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

  execute() {
    const command = this.command;
    const envs = this.envs || {};
    envs.PORT = this.port;
    envs.NODE_V8_COVERAGE = this.coveragePath;
    return new Promise((resolve, reject) => {
      if (typeof command === "string") {
        let initialized = false;
        const server = spawn(command, {
          shell: true,
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
        this._server = server;
      } else {
        throw new Error(
          `Executor: command should be a string but received ${typeof command}`
        );
      }
    }).then(() => {
      if (!this.port) return this.server;
      return this.isReady();
    });
  }

  log(str) {
    global.restqa && global.restqa.outputStream.addDebugLog(str);
  }

  async isReady() {
    logger.info("service.run.waiting_server");
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
        socket.on("ready", function (err) {
          if (err) reject(err);
          resolve();
          socket.destroy();
          isOut = true;
        });
        socket.on("error", function (err) {
          socket.destroy();
          timeout -= 200;
          if (err.code !== "ECONNREFUSED") {
            isOut = true;
            return reject(err);
          }
          if (timeout > 0) {
            idTimeout = setTimeout(checker, 200);
          } else {
            isOut = true;
            reject(
              new Error(
                format(Locale.get("error_port_timeout"), port, DEFAULT_TIMEOUT)
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

  terminate() {
    return new Promise((resolve, reject) => {
      if (this.server instanceof ChildProcess) {
        kill(this.server.pid, "SIGTERM", (err) => {
          if (err) return reject(err);
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}

module.exports = Executor;
