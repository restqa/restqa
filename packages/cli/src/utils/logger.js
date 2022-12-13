const chalk = require("chalk");
const debug = require("debug")("restqa");
const {format} = require("util");
const Locale = require("../locales")();

function _log() {
  console.info(format.apply(this, arguments)); // eslint-disable-line no-console
}

module.exports = {
  debug: function () {
    debug(...arguments);
  },
  error: function () {
    if (!(arguments[0] instanceof Error)) {
      arguments[0] = Locale.get(arguments[0]) || arguments[0];
    } else if (
      arguments[0].constructor &&
      arguments[0].constructor.name === "VError"
    ) {
      arguments[0] = arguments[0].jse_cause;
    } else {
      debug(arguments[0]);
    }
    arguments[0] = chalk.bold.red.call(this, arguments[0]);
    _log.apply(this, arguments);
  },
  info: function () {
    arguments[0] = Locale.get(arguments[0]) || arguments[0];
    arguments[0] = chalk.bold.blue.call(this, arguments[0]);
    _log.apply(this, arguments);
  },
  log: function () {
    arguments[0] = Locale.get(arguments[0]) || arguments[0];
    _log.apply(this, arguments);
  },
  success: function () {
    arguments[0] = Locale.get(arguments[0]) || arguments[0];
    arguments[0] = chalk.bold.green.call(this, arguments[0]);
    _log.apply(this, arguments);
  },
  warning: function () {
    arguments[0] = Locale.get(arguments[0]) || arguments[0];
    arguments[0] = chalk.bold.yellow.call(this, arguments[0]);
    _log.apply(this, arguments);
  }
};
