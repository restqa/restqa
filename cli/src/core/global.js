const Config = require("../config");
const {Writable} = require("stream");
const chalk = require("chalk");

class Global {
  constructor(options = {}) {
    this._env = options.env;
    this._configFile = options.configFile;
    this._report = options.report;
    this._stream = {
      exporter: options.exportStream,
      output: options.outputStream
    };
    this._silent = options.silent || false;
  }

  isLocalTest() {
    return undefined === this.env;
  }

  get configFile() {
    return this._configFile;
  }

  get report() {
    return this._report || false;
  }

  get env() {
    return this._env;
  }

  get silent() {
    return this._silent;
  }

  get config() {
    if (!this._config) {
      this._config = new Config();
      this._config.load(this._configFile);
    }
    return this._config;
  }

  get exportStream() {
    return this._stream.exporter;
  }

  get outputStream() {
    if (!this._stream.output) {
      const opt = {
        silent: this.silent
      };
      this._stream.output = new Output(opt);
    }
    return this._stream.output;
  }
}

class Output extends Writable {
  constructor(options = {}) {
    super(options);
    this._stack = {};
    this._stdout = options.stdout || process.stdout;
    this._debug = [];
    this._silent = options.silent;
  }

  _write(chunk, encoding, callback) {
    this._stdout.write(chunk.toString());
    callback();
  }

  getStack() {
    return this._stack;
  }

  findByStatus(status) {
    return Object.values(this.getStack()).filter(
      (obj) => obj.status === status
    );
  }

  get(uuid) {
    return this._stack[uuid];
  }

  add(testCase) {
    this._stack[testCase.uuid] = testCase;
  }

  updateStatus(uuid, status, error) {
    const instance = this.get(uuid);
    instance.status = status;
    this.write(instance.toString());
    if (this._debug.length) {
      this.write(`  |> DEBUG: log\n`);
      this._debug
        .reduce((all, item) => {
          all.push("--");
          all.push(item);
          return all;
        }, [])
        .flat()
        .filter((str) => str.trim())
        .forEach((str) => {
          this.write(`    ${str}\n`);
        });
    }

    if (error) {
      this.write(error);
    }

    this._debug = [];
  }

  set success(val) {
    this._success = val;
    this.end(this.getResult());
  }

  get success() {
    return this._success;
  }

  get silent() {
    return this._silent || false;
  }

  addDebugLog(str) {
    if (this.silent) return;
    if (Object.keys(this.getStack()).length === 0) {
      this.write(`> DEBUG: ${str}`);
    } else {
      this._debug.push(str.split("\n"));
    }
  }

  getResult() {
    const passed = this.findByStatus("PASSED").length;
    const skipped = this.findByStatus("SKIPPED").length;
    const failed = this.findByStatus("FAILED").length;
    const total = Object.keys(this.getStack()).length;

    const summary = [];
    if (failed) summary.push(chalk.red(`${failed} failed`));
    if (skipped) summary.push(chalk.yellow(`${skipped} skipped`));
    if (passed) summary.push(chalk.green(`${passed} passed`));
    if (total) summary.push(`${total} total`);
    if (total === 0)
      summary.push(chalk.magenta(`}> NO TEST SCENARIO FOUND 😔 <{`));

    return `
---
${summary.join(", ")}
---\n`.trimStart();
  }
}

Global.Output = Output;

module.exports = Global;
