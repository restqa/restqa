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

  async execute() {
    const command = this.command;
    const envs = this.envs || {};
    envs.PORT = this.port;
    envs.NODE_V8_COVERAGE = this.coveragePath;

    return new Promise((resolve, reject) => {
      if (typeof command === "string") {
        let initialized = false;

        const args = command.split(' ');
        const cmd = args.shift();
        // eslint-disable-next-line
        console.log(cmd, args);
        const server = spawn(cmd, args, {
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
      // Todo(tony): we should extract this into another method
      if (!this.port) return this.server;
      return this.checkServer();
    });
  }

  log(str) {
    global.restqa && global.restqa.outputStream.addDebugLog(str);
  }

  async checkServer() {
    logger.info("service.run.waiting_server");
    const port = this.port;
    let timeout = this.timeout;
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
            reject(
              new Error(
                format(Locale.get("error_port_timeout"), port, DEFAULT_TIMEOUT)
              )
            );
          }
        });
      };
      checker();
    })
      .then(() => {
        this._isRunning = true;
      })
      .then(() => {
        return this.server;
      });
  }

  terminate() {
    return new Promise((resolve, reject) => {
      if (this.server instanceof ChildProcess) {
        const pid = this.server.pid;
        const status = this.server.kill();
        if (!status) {
          reject(new Error(`Executor: failed to terminate process: ${pid}`));
          return
        }
        resolve();
      } else {
        resolve();
      }
    });
  }
}

module.exports = Executor;
